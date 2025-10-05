<?php

namespace App\Services;

use Exception;
use Gemini\Data\GenerationConfig;
use Gemini\Data\Schema;
use Gemini\Enums\DataType;
use Gemini\Enums\ResponseMimeType;
use Illuminate\Http\UploadedFile;
use Smalot\PdfParser\Parser;
use Gemini\Laravel\Facades\Gemini;

class FlashcardGeneratorService
{
    /**
     * Parses the PDF file and generates flashcard data using the Gemini API.
     *
     * @param UploadedFile $file The PDF file uploaded by the user.
     * @return array The structured data containing title, description, and flashcards.
     */
    public function generateFlashcardsFromPdf(UploadedFile $file): array
    {
        $user = auth()->user()->load('userinfo');
        if ($user->userinfo()->first()->subscription_plan == "free") {
            $pages = $this->countPages($file);
            $cost = $pages * 50;
            if ($user->userinfo()->first()->gems < $cost) {
                abort(402, "Insufficient gems. You need {$cost} gems to process this document.");
            }
            $user->userinfo()->first()->decrement('gems', $cost);
        }
        $parsedText = $this->parsePdf($file);
        $config = new GenerationConfig(
            responseMimeType: ResponseMimeType::APPLICATION_JSON,
            responseSchema: new Schema(
                type: DataType::OBJECT,
                properties: [
                    'title' => new Schema(type: DataType::STRING),
                    'description' => new Schema(type: DataType::STRING),
                    'flashcards' => new Schema(
                        type: DataType::ARRAY,
                        items: new Schema(
                            type: DataType::OBJECT,
                            properties: [
                                'question' => new Schema(type: DataType::STRING),
                                'answer' => new Schema(type: DataType::STRING),
                            ],
                            required: ["question", "answer"]
                        )
                    )
                ],
                required: ["title", "description", "flashcards"]
            )
        );
        $prompt = "Based on the following text from a document, please:
                    1. Detect the language of the provided text.
                    2. Use that same language consistently in your response.
                    Then, generate the following based on the content:
                    - A concise and relevant title
                    - A short and clear description summary (max: 100 characters )
                    - A series of question-and-answer flashcards to help a user study the material
                    Ensure the flashcards are accurate, easy to understand, and focused on key concepts, facts, or definitions.
                    Here is the text:\n\n" . $parsedText;

        $response = Gemini::generativeModel(model: "gemini-2.0-flash-lite")
            ->withGenerationConfig($config)
            ->generateContent($prompt);

        return json_decode(json_encode($response->json()), true);
    }

    /**
     * Extracts text content from a given PDF file.
     *
     * @param UploadedFile $file
     * @return string
     */
    private function parsePdf(UploadedFile $file): string
    {
        try {
            $parser = new Parser();
            $rawText = $parser->parseFile($file->getPathname())->getText();
            return mb_convert_encoding($rawText, 'UTF-8', 'UTF-8');
        } catch (Exception $err) {
            abort(500, "Error parsing the PDF file. Please try again later.");
        }
    }

    /**
     * Counts the number of pages in a given PDF file.
     *
     * @param UploadedFile $file
     * @return int
     */
    private function countPages(UploadedFile $file): int
    {
        try {
            $parser = new Parser();
            $pdf = $parser->parseFile($file->getPathname());
            return count($pdf->getPages());
        } catch (Exception $err) {
            abort(500, "Error counting the pages of the PDF file. Please try again later.");
        }
    }
}

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

        // 3. Create a clear prompt for the AI model.
        $prompt = "Based on the following text from a document, please:
                    1. Detect the language of the provided text.
                    2. Use that same language consistently in your response.
                    Then, generate the following based on the content:
                    - A concise and relevant title
                    - A short and clear description (summary)
                    - A series of question-and-answer flashcards to help a user study the material
                    Ensure the flashcards are accurate, easy to understand, and focused on key concepts, facts, or definitions.
                    Here is the text:\n\n" . $parsedText;

        // 4. Call the Gemini API with the prompt and configuration.
        $response = Gemini::generativeModel(model: "gemini-2.0-flash-lite")
            ->withGenerationConfig($config)
            ->generateContent($prompt);

        // 5. Decode the JSON response and return it as an array.
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
            return $parser->parseFile($file->getPathname())->getText();
        } catch (Exception $err) {
            // It's often better to throw an exception and let the controller handle the HTTP response.
            abort(500, "Error parsing the PDF file. Please try again later.");
        }
    }
}

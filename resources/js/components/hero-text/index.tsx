import { Button, Container, Text, Title } from '@mantine/core';
import { Dots } from './dots';
import classes from './index.module.css';

export default function HeroText() {
    return (
        <Container className={classes.wrapper} size={1400}>
            <Dots className={classes.dots} style={{ left: 0, top: 80 }} />
            <Dots className={classes.dots} style={{ left: 60, top: 80 }} />
            <Dots className={classes.dots} style={{ left: 0, top: 220 }} />
            <Dots className={classes.dots} style={{ left: 0, top: 480 }} />
            <Dots className={classes.dots} style={{ left: 0, top: 540 }} />
            <Dots className={classes.dots} style={{ left: 80, top: 540 }} />
            <Dots className={classes.dots} style={{ right: 0, top: 140 }} />
            <Dots className={classes.dots} style={{ right: 0, top: 440 }} />

            <div className={classes.inner}>
                <Title className={classes.title}>
                    Turn your study materials into{' '}
                    <Text
                        component="span"
                        className={classes.highlight}
                        inherit
                    >
                        smart flashcards
                    </Text>{' '}
                    instantly
                </Title>

                <Container p={0} size={600}>
                    <Text size="lg" c="dimmed" className={classes.description}>
                        Upload notes, PDFs, or slides and our AI transforms them
                        into interactive flashcard decks that help you study
                        more efficiently, remember key ideas, and track your
                        progress.
                    </Text>
                </Container>

                <div className={classes.controls}>
                    <Button
                        onClick={() => (window.location.href = '/login')}
                        className={classes.control}
                        size="lg"
                        variant="default"
                        color="gray"
                    >
                        Try it free
                    </Button>
                    <Button
                        onClick={() => (window.location.href = '/create')}
                        className={classes.control}
                        size="lg"
                    >
                        Generate my deck
                    </Button>
                </div>
            </div>
        </Container>
    );
}

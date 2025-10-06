import { useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import { Button, Group, Text } from '@mantine/core';
import { router } from '@inertiajs/react';

interface DailyRewardNotificationProps {
    rewardInfo: {
        can_claim: boolean;
        final_gems: number;
        base_gems: number;
        has_subscription: boolean;
        total_gems: number;
    };
}

export function DailyRewardNotification({ rewardInfo }: DailyRewardNotificationProps) {
    useEffect(() => {
        if (rewardInfo.can_claim) {
            showRewardNotification();
        }
    }, [rewardInfo.can_claim]);

    const claimReward = () => {
        router.post('/daily-reward/claim', {}, {
            onSuccess: () => {
                notifications.hide('daily-reward');

                notifications.show({
                    title: "Reward Claimed!",
                    message: `You received ${rewardInfo.final_gems} gems! Total: ${rewardInfo.total_gems + rewardInfo.final_gems} 💎`,
                    color: 'green',
                    autoClose: 3000,
                });
            },
            onError: () => {
                notifications.show({
                    title: "Error",
                    message: "Failed to claim reward. Please try again.",
                    color: 'red',
                });
            }
        });
    };

    const showRewardNotification = () => {
        notifications.show({
            id: 'daily-reward',
            autoClose: false,
            withCloseButton: true,
            onClose: () => console.log('Daily reward notification closed'),
            onOpen: () => console.log('Daily reward notification opened'),
            title: "Daily Reward Available!",
            color: 'green',
            message: (
                <div>
                    <Text size="sm" mb="xs">
                        Claim your daily gems! You'll receive:{' '}
                        <Text span fw={700}>
                            {rewardInfo.final_gems} gems
                        </Text>
                    </Text>

                    {rewardInfo.has_subscription && (
                        <Text size="xs" c="blue" mb="xs">
                            ✨ Premium bonus applied! (+{Math.round(rewardInfo.base_gems * 0.5)} gems)
                        </Text>
                    )}

                    <Group gap="xs">
                        <Button
                            size="xs"
                            onClick={claimReward}
                            variant="filled"
                            color="teal"
                        >
                            Claim Now
                        </Button>
                        <Text size="xs" c="dimmed">
                            {rewardInfo.total_gems} total gems
                        </Text>
                    </Group>
                </div>
            ),
            style: {
                border: '1px solid var(--mantine-color-default-border)'
            },
        });
    };

    return null;
}

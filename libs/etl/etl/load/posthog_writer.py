from posthog import Posthog
import os
from dotenv import load_dotenv


class PosthogManager:
    def __init__(self):
        load_dotenv()
        self.write_api_key = os.getenv("POSTHOG_WRITE_API_KEY", "")
        self._posthog_client = None
        self._events_to_create = []

        if not self.project_id or not self.write_api_key or not self.read_api_key:
            raise ValueError(
                "Missing PostHog configuration. Ensure POSTHOG_WRITE_API_KEY is set in the environment."
            )

        try:
            self._posthog_client = Posthog(
                self.write_api_key, host="https://eu.i.posthog.com"
            )
        except Exception as error:
            print(error)

    def add_to_events_to_create(self, event_name, linked_event_id, person_id):
        self._events_to_create.append(
            {
                "linked_event_id": linked_event_id,
                "person_id": person_id,
                "event_name": event_name,
            }
        )

    async def create_events(self):
        if not self._posthog_client:
            raise ValueError("PostHog client is not initialized")

        try:
            for event in self._events_to_create:
                self._posthog_client.capture(
                    {
                        "distinct_id": event["person_id"],
                        "event": event["event_name"],
                        "properties": {"linked_event_id": event["linked_event_id"]},
                    }
                )
            self._events_to_create = []
        except Exception as error:
            print("Failed to send events:", error)
        finally:
            await self._posthog_client.shutdown()

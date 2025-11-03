from posthog import Posthog
from etl.tools.config.config import Config

### Copy from a small python tool used a couple time in the TEE project
### currently not in use in the package
class PosthogManager:
    def __init__(self):
        self.write_api_key = Config.POSTHOG_WRITE_API_KEY()
        self._posthog_client = None
        self._events_to_create = []

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

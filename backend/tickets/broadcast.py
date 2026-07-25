from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


def broadcast_ticket_update(action, ticket_data):
    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        "ticket_updates",
        {
            "type": "ticket_update",
            "action": action,
            "ticket": ticket_data,
        }
    )
async def broadcast_data(data: dict):
    from routers.dashboard import connected_clients
    for client in connected_clients:
        await client.send_json(data)
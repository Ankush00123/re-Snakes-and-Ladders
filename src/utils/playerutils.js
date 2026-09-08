export const updateLocalPlayers = (player, players) =>
{
    return players.map((current) => (
        player.id == current.id ? player : current
    ))
}
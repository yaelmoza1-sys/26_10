export async function findPlayerByName(name) {
    try {
        const res = await fetch(
            `http://localhost:3000/api/players/search?name=${encodeURIComponent(name)}`
        );

        if (!res.ok) throw new Error("Failed to find player");

        return await res.json();
    }
    catch (error) {
        console.error("Server error:", error.message);
        return undefined;
    }
}

export async function createPlayer(name) {
    try {
        const newPlayer = {
            name,
            lowestTime: null
        };
        const res = await fetch(`http://localhost:3000/api/players`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify(newPlayer)
        
        })

        if (!res.ok) throw new Error("Failed to create player");
        return await res.json();
    }

    catch (error) {
        console.error("Server error:", error.message);
        return null;
    }
}

export async function updatePlayer(player){
    try{
        const res = await fetch(`http://localhost:3000/api/players/${player.id}`,{
            method: `PUT`,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(player)
        })
        if(!res.ok)throw new Error("Failed to update player");
        return await res.json();
    }
    catch (error) {
        console.error("Server error:", error.message)
        return null;
    }
}

export async function getAllPlayers() {
    try {
        const res = await fetch(`http://localhost:3000/api/players`)
        if (!res.ok) throw new Error("Failed to fetch players")
        return await res.json()
    }

    catch (error) {
        console.error("Server error:", error.message)
        return []
    }

}

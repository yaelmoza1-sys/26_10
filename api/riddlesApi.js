export async function getAllRiddles() {
    try {
        const res = await fetch(`http://localhost:3000/riddles`)
        if (!res.ok) throw new Error("Failed to fetch riddles")
        return await res.json()
    }

    catch (error) {
        console.error("Server error:", error.message)
        return []
    }
}

export async function createRiddle(riddleData) {
    try {
        const res = await fetch(`http://localhost:3000/riddles`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify(riddleData)
        
        })

        if (!res.ok) throw new Error("Failed to create riddle");
        return await res.json();
    }

    catch (error) {
        console.error("Server error:", error.message);
        return null;
    }
}


export async function updateRiddle(id, riddle){
    try{
        const res = await fetch(`http://localhost:3000/riddles/${id}`,{
            method: `PUT`,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(riddle)
        })
        if(!res.ok)throw new Error("Failed to update riddle");
        return await res.json();
    }
    catch (error) {
        console.error("Server error:", error.message)
        return null;
    }
}

export async function deleteRiddle(id){
    try{
        const res = await fetch(`http://localhost:3000/riddles/${id}`,{
            method: `DELETE`
        })
        if(!res.ok)throw new Error("Failed to delete  riddle");
        return true;
    }
    catch (error) {
        console.error("Server error:", error.message)
        return null;
    }
}
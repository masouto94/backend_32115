const deleteOwnAccountButton = document.querySelector("#deleteOwnAccount")
const deleteAccountByIdForm = document.querySelector("#deleteAccountById")
const forceInactiveDeletionButton = document.querySelector("#forceInactiveDeletion")

const deleteAccount = async (e) =>{
    e.preventDefault()
    if (!confirm("Queres borrar tu cuenta y todo lo relacionado a ella?")){
        return
    }
    const deleteUserResponse = await fetch("/users/current",{method:"DELETE"}).then(r=>r.json())
    alert(JSON.stringify(deleteUserResponse))
}

const deleteAccountById = async (userDeletionForm) =>{
    if (!confirm(`Queres borrar la cuenta ${userDeletionForm.get("userId")} y todo lo relacionado a ella?`)){
        return
    }
    const deleteUserResponse = await fetch(`/users/${userDeletionForm.get("userId")}`,{method:"DELETE"}).then(r=>r.json())
    alert(JSON.stringify(deleteUserResponse))
    document.querySelector("#userIdForDeletion").value=""

}
const forceInactiveDeletion = async (e) =>{
    const deleteUserResponse = await fetch("/users/inactiveUsers",{method:"DELETE"}).then(r=>r.json())
    console.table(JSON.stringify(deleteUserResponse))
}
if(deleteOwnAccountButton){
    deleteOwnAccountButton.addEventListener("click", async (e) =>{
        await deleteAccount(e)
        })
}
else{

    deleteAccountByIdForm.addEventListener("submit", async (e) => {
        e.preventDefault()

        let content = new FormData(deleteAccountByIdForm)
        await deleteAccountById(content)
    })
    forceInactiveDeletionButton.addEventListener("click", async (e) => {
        await forceInactiveDeletion()
    })
}
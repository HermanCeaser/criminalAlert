


const conRowSelected = function (items) {

    if(items == null){
        return false;
    }

    if(items == ''){
        return false;
    }

    return  true;
}

const closeModal = function(selectableTable) {
    if(selectableTable == null)return true 

    if(selectableTable == '')return true

    return false
    
}

const showModal = function(refs) {
    if(refs == null)return true 

    if(refs == '')return true

    return false
    
}

const editContent = function(isEditing) {

    if(isEditing == null)return true 

    if(isEditing == '')return true

    if (!isEditing) return true
    
    
    return  false;


}


module.exports = {
    conRowSelected,
    closeModal,
    showModal,
    editContent,
}

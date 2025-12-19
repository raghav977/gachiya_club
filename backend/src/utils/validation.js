export const fieldValidation = (...data)=>{
    for(let value of data){
        if(!value){
            return false;
        }
        return true;
    }
}
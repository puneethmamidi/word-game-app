function practice_validations(values){
    let error = {}
    //const user_data_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])+$/
    if(values.user_data.length === 0){
        error.user_data = " Answer should not be empty"
    }
    return error;
}
export default practice_validations;
function sign_validation(values){
    let error = {}
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&])[a-zA-Z0-9!@#$%^&]{8,}$/

    if(values.email === ""){
        error.email = "Email Required"
    }
    else if(!email_pattern.test(values.email)){
        error.email = "Email Didn't match"
    }else{
        error.email = ""
    }

    if(values.password === ""){
        error.password = "Password Required"
    }
    else if(!password_pattern.test(values.password)){
        error.password = "Password Didn't match"
    }else{
        error.password = ""
    }

    if(values.age === ""){
        error.age = "Age Required"
    }else{
        error.age = ""
    }

    if(values.username === ""){
        error.username = "Username Required"
    }else{
        error.username = ""
    }
    return error;
}

export default sign_validation;
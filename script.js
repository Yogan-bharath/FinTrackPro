const login_register = document.querySelector(".login-register")
const main = document.querySelector("main")
const login = document.querySelector(".login")
const register = document.querySelector(".register")
const goToLogin = document.querySelector(".goToLogin")
const goToRegister = document.querySelector(".goToRegister")
const dashboard = document.querySelector(".dashboard")
const settings = document.querySelector(".settings")
const setting = document.querySelector(".setting")
const add_tran = document.querySelector(".add-tran");
const overlay = document.querySelector(".overLay")
const close = document.querySelector(".ri-close-line");
const new_tran = document.querySelector(".new-tran");
const table = document.querySelector("table");
const Current_Balance = document.querySelector(".Current_Balance")
const Total_Income = document.querySelector(".Total_Income")
const Total_Expense = document.querySelector(".Total_Expense")
const Total_Transactions = document.querySelector(".Total_Transactions")
const user = JSON.parse(localStorage.getItem("user"))

var count_Current_Balance = 0;
var count_Current_Balance = 0
var count_Total_Income = 0
var count_Total_Expense = 0
var count_Total_Transactions = 0

console.log(user)
new_tran.addEventListener("submit",(e)=>{
    e.preventDefault()
    const [type,des,amount,date,cat] = e.target;
    if(!type.value || !des.value || !amount.value || !date.value || !cat.value) return;
    const newTran = {
        id:Date.now(),
        type:type.value,
        description:des.value,
        amount:amount.value,
        date:date.value,
        category:cat.value
    }
    const user = JSON.parse(localStorage.getItem("user"))
    var transations = JSON.parse(localStorage.getItem(`transactions_${user.username}`)) || [];
    transations.push(newTran);
    localStorage.setItem(`transactions_${user.username}`,JSON.stringify(transations));
    new_tran.reset();
    transations = JSON.parse(localStorage.getItem(`transactions_${user.username}`)) || [];
    renderTransactions(transations);
    overlay.classList.toggle("none");
})
close.addEventListener("click",()=>{
    overlay.classList.toggle("none")
})
add_tran.addEventListener("click",(e)=>{
    overlay.classList.toggle("none")
})
dashboard.addEventListener("click",(e)=>{
    e.target.classList.add("active")
    settings.classList.remove("active")
})
settings.addEventListener("click",(e)=>{
    dashboard.classList.remove("active")
    e.target.classList.add("active")
})
goToLogin.addEventListener("click",()=>{
    register.style.display = "none"
    login.style.display = "flex"
})
goToRegister.addEventListener("click",()=>{
    login.style.display = "none"
    register.style.display = "flex"
})
login.addEventListener("submit",(e)=>{
    e.preventDefault()
    console.log(e);
})
register.addEventListener("submit",(e)=>{
    e.preventDefault();
    const [username , password] = e.target
    if(!username || !password) return;
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const user = {
        username: username.value,
        password:password.value
    }
    const isUserPresent = registeredUsers.find((e)=>e.username==user.username)
    if(isUserPresent){
        alert("This Useranme Already Exist!!!")
        return;
    }
    registeredUsers.push(user)
    localStorage.setItem("registeredUsers",JSON.stringify(registeredUsers));
    register.style.display = "none"
    login.style.display = "flex"
    alert("user created successufully")
})
login.addEventListener("submit",(e)=>{
    e.preventDefault();
    const [username , Password] = e.target;
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers"))
    const user = registeredUsers.find((user)=>user.username==username.value);
    const {password , ...newObj} = user;
    newObj.currency = "$"
    if(!user){
        alert("Sorry User not found")
        return;
    }else{
        if(password===Password.value){
            console.log("here")
            localStorage.setItem("user",JSON.stringify(newObj));
        }else{
            alert("Incorrect Password");
            return;
        }
    }
    alert("User Login successfully")
    location.reload();
})
table.addEventListener("click",(e)=>{
    if(!e.target.classList.contains("table")){
        const isDelete = e.target.classList.contains("ri-delete-bin-7-fill");
        if(isDelete){
            const tr = e.target.closest("tr");
            const id = tr.dataset.id;
            const transations = JSON.parse(localStorage.getItem(`transactions_${user.username}`)) || [];
            const newTran = transations.filter((e)=>e.id!=id);
            localStorage.setItem(`transactions_${user.username}`,JSON.stringify(newTran));
            renderTransactions(newTran)
            location.reload()
        }
    }
})
const calAmount = ()=>{
Current_Balance.innerHTML = `${user.currency} <span>${count_Current_Balance}</span> `
Total_Income.innerHTML = `${user.currency} <span>${count_Total_Income}</span> `
Total_Expense.innerHTML = `${user.currency} <span>${count_Total_Expense}</span> `
Total_Transactions.innerHTML = `${user.currency} <span>${count_Total_Transactions}</span> `
}

const renderTransactions = (trans)=>{
    
    // table.innerHTMl = ``
    let tr = ``;
    trans.forEach((element) =>{
        console.log(element)
        tr+=`<tr data-id=${element.id}>
                <td>${element.date}</td>
                <td>${element.description}</td>
                <td><span class="cat">${element.category}</span></td>
                <td class="green">+${user.currency + element.amount}</td>
                <td class="actions">
                    <i class="ri-pencil-fill"></i>
                    <i class="ri-delete-bin-7-fill"></i>
                </td>
            </tr>`
        if(element.type=="expense"){
            count_Total_Expense+=parseInt(element.amount);
            count_Current_Balance-=parseInt(element.amount);
        }
        else{
            count_Total_Income+=parseInt(element.amount);
            count_Current_Balance+=parseInt(element.amount);
        }
        count_Total_Transactions+=1;
    });
    table.innerHTML+=tr;
    calAmount()
}


if(!user){
    main.style.display = "none";
}else{
    login_register.style.display = "none";
    setting.style.display = "none";
    const transations = JSON.parse(localStorage.getItem(`transactions_${user.username}`)) || [];
    renderTransactions(transations)
}


import axios from "axios";

function solutionA(str) {
  if (typeof str !== "string") {
    return;
  }
  const len = str.length
  if(len > 10){

    const f = str[0];
    const l = str[len - 1];
    const n = len - 2;
    return f + n + l;
  }else{
    return str
  }
}

function solutionB(str) {
  if (typeof str !== "string") {
    return;
  }

  const [n, m, a] = str.trim().split(" ").map(Number);
  const numStones = Math.ceil(n / a) * Math.ceil(m / a);
  return numStones.toString();
}


function tong(n){
  let s = 0
  for(let i = 1 ; i <=n ; i++){
    s +=i
  }
  return s
}
// s = k *(1+2+3+...+n)
// k * n+1*n/2
function solutionC(str) {
  if (typeof str !== "string") {
    return;
  }
  const [n, k] = str.trim().split(" ").map(Number);
  const s = (k * n * (n + 1)) / 2;
  return s.toString();
}

let username = "tranhongankrn.2001@gmail.com";
async function register() {
  try {
    let password = ''
    const { data } = await axios.post(
      "https://fresher-program.woay.xyz/user/register",
      {
        email: username,
      }
    );
    password = data.password;
    return password
  } catch (error) {
    console.log(error);
    throw Error(error)
  }
}
async function login(password) {
  try {
    let token = ''
    const { data } = await axios.post(
      "https://fresher-program.woay.xyz/user/login",
      {
        email: username,
        password: password,
      }
    );
    token = data.token;
    return token
  } catch (error) {
    throw Error(error)

    console.log(error);
  }
}
async function getTestcase(problem , token) {
  try {
    //   const auth = Buffer.from(`tranhongankrn.2001@gmail.com:${password}`).toString('base64');
    let index = 0;
    while(index < 100){
    const { data } = await axios.post(
      `https://fresher-program.woay.xyz/problem/${problem}/testcase`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    let result;
    if (problem === "A") {
      result = solutionA(data.testcase);
    } else if (problem === "B") {
      result = solutionB(data.testcase);
    } else if (problem === "C") {
      result = solutionC(data.testcase);
    }

    if (result) {
      const isPass = await submit(data.submit_key, result , token);
      if (isPass) {
        index += 1;
      }
    }

    }
  } catch (error) {
    console.log(error.message);
  }
}

async function submit(submitkey, solution , token) {
  try {
    const { data } = await axios.post(
      "https://fresher-program.woay.xyz/problem/submit",
      {
        submit_key: submitkey,
        solution: solution,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("rs", data);
    if (data.message === "Passed") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function main() {
  const pass =   await register();
  const token =   await login(pass);
  await getTestcase("A" , token);
  await  getTestcase('B' , token)
  await  getTestcase('C' , token)
}
main();



export const generateId = ()=>{
    const random = Math.random().toString(32).substring(2);
    const date = Date.now(32);
    return random + date
}

import{useEffect,useState}from'react';
/* === HOOK DE LOCAL STORAGE | inicio === */
export function useLocalStorage<T>(chave:string,valorInicial:T):[T,(novoValor:T)=>void]{const[valor,definirValorInterno]=useState<T>(()=>{try{const salvo=window.localStorage.getItem(chave);return salvo?JSON.parse(salvo)as T:valorInicial}catch{return valorInicial}});function definirValor(novoValor:T):void{definirValorInterno(novoValor)}useEffect(()=>{try{window.localStorage.setItem(chave,JSON.stringify(valor))}catch{/* fallback em memoria */}},[chave,valor]);return[valor,definirValor]}
/* === HOOK DE LOCAL STORAGE | fim === */

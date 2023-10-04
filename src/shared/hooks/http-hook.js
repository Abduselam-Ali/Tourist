import {useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () =>{
        const [isLoading, setIsLoading] = useState(false);
        const [isLoadingL, setIsLoadingL] = useState(true);
        const [error, setError] = useState(null);

        const activeHttpRequests = useRef([]);

        const sendRequest = useCallback (async (
            url, 
            method = 'GET' , 
            body= null, 
            headers = {}) => {

            setIsLoading(false);
            setIsLoadingL(false);
            const httpAbortCtrl = new AbortController()
            activeHttpRequests.current.push(httpAbortCtrl);
            try{
                 const response= await fetch(url, {
                    method,
                    body,
                    headers,
                    signal:httpAbortCtrl.signal
                });
            const responseData = await response.json();
                activeHttpRequests.current = activeHttpRequests.current.filter(
                    reqCtrl => reqCtrl !== httpAbortCtrl)

            if(!response.ok)
            {
            throw new Error(responseData.message);
            }
            setIsLoading(false);
            setIsLoadingL(false);
            setError(null);
            return responseData;
            }catch(err){
                setError(err.message)
                setIsLoading(false);
                setIsLoadingL(false);
                throw err;
            }
              
        }, []); 
        const clearError = () => {
            setError(null);
        }   
    useEffect (() => {
        return () => {
           activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort()) 
        }
    },[])
    return {isLoading, isLoadingL, error, sendRequest, clearError}    
};
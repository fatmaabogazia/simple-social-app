
import { createContext, useState } from "react";

// من عيوب ال context ان كل ال component اللي بتستخدمه لما يحصل اي تغير فيه هيحصل لهاا rerender وداا مش احسن حاجه لل performance 

// any context contain ==> variable and function

// الاحسن ان اسم المتغير يكون نفس اسم الملف 
export let CounterContext = createContext();

// والفنكشن اسم الملف + كلمه Provider 
export default function CounterContextProvider(props) {

    let [count, setCount] = useState(0);
    // عادي ممكن مخليهوش شير علي الموقع كله 
    let [test, setTest] = useState(null);


    //                                                       بنحط فيهاا الحاجات اللي عاوزينهاا تبقي شير علي كل الكومبوننت                                
    //      اول قوسين للبيندنج والتانين علشان هو لازم بياخد اوبجكت      المفروض جواا هنااا هحط الملف كلههه
    return <CounterContext.Provider value={{ count, setCount }}  >
        {/* App */}
        {props.children}

    </CounterContext.Provider>
}

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Home from './Components/Home/Home';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Profile from './Components/Profile/Profile';
import Layout from './Components/Layout/Layout';
import Notfound from './Components/Notfound/Notfound';

import { HeroUIProvider } from "@heroui/react";
import CounterContextProvider from './Context/CounterContext';
import UserContextProvider from './Context/UserContext';
import { PostsContextProvider } from './Context/PostsContext';

import ProutectedRoute from './Components/ProutectedRoute/ProutectedRoute';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import PostDetails from './Components/PostDetails/PostDetails';
import { Toaster } from 'react-hot-toast';



function App() {

  let query = new QueryClient()

  let route = createBrowserRouter([
    {
      path: "", element: <Layout />, children: [
        {
          index: true, element:
            <ProutectedRoute>
              <Home />
            </ProutectedRoute>
        },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        {
          path: "profile", element: <ProutectedRoute>
            <Profile />
          </ProutectedRoute>
        },
        {
          path: "postDetails/:id", element: <ProutectedRoute>
            <PostDetails />
          </ProutectedRoute>
        },
        { path: "*", element: <Notfound /> },
      ]
    }

  ])


  return (
    <>
      <UserContextProvider>

        <PostsContextProvider>
          {/* هنراب الموقع كلهه جوااهاا او زي ان ببعتلهاا الملف كلهه */}
          <CounterContextProvider>

            <HeroUIProvider>
              <QueryClientProvider client={query}>

                <RouterProvider router={route}> </RouterProvider>
                <Toaster />

                <ReactQueryDevtools></ReactQueryDevtools>

              </QueryClientProvider>
            </HeroUIProvider>

          </CounterContextProvider>
        </PostsContextProvider>

      </UserContextProvider>

    </>
  )
}

export default App





// npm i generate-react-cli
// npx generate-react-cli
// وبعدين اروح في ال  اعمل فولدر اسمه Template ==> file => TemplateName.jsx => and file => TemplateName.module.css 
// وبعدين اروح علي ملف المكتبه وفي ال default نعمل customTemplates بيكون اوبجكت واحط فيه component واديله عنوان التمبلت "./src/Template/TemplateName.jsx"
// وبعدين اكتب ف التيرمنال 
// npx generate-react-cli component Home  

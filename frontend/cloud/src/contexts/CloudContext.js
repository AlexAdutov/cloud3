/*

Этот код создает контекст CloudContext с помощью функции createContext из библиотеки React. 
Контекст предоставляет способ передачи данных через дерево компонентов без необходимости 
передачи пропсов через каждый промежуточный компонент. В данном случае создается контекст 
для обмена данными между компонентами в облачном приложении
*/

import {createContext} from 'react'

export const CloudContext = createContext({})
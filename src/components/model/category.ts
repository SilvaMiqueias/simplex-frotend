export interface Category{
  id: number;
  name: string;
  description: string;
}

export const categoryList:  Array<Category> = [
  {id: 0, name: 'FOOD', description: 'Alimentação'},
  {id: 1, name: 'HEALTH', description: 'Saúde'},
  {id: 2, name: 'TRANSPORT', description: 'Transporte'},
  {id: 3, name: 'EDUCATION', description: 'Educação'},
  {id: 4, name: 'ENTERTAINMENT', description: 'Entretenimento'},
  {id: 5, name: 'HOUSING', description: 'Habitação'},
  {id: 6, name: 'SALARY', description: 'Salário'},
  {id: 7, name: 'INVESTMENT', description: 'Investimento'},
  {id: 8, name: 'TAXES', description: 'Impostos'},
  {id: 9, name: 'UTILITIES', description: 'Utilidades'},
  {id: 10, name: 'OTHER', description: 'Outros'}
 ];

 export function getAllCategories(): Array<Category>{
    return categoryList;
 }

 
 export function getDescriptionCategory(name: string){
   return categoryList.find(item => item.name === name).description;
 }

  export function getDescriptionCategoryById(id: number){
   return categoryList.find(item => item.id === id).description;
 }

   export function getNameCategoryById(id: number){
   return categoryList.find(item => item.id === id).name;
 }

import { headers } from "@/next.config";
import { data } from "autoprefixer";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"; 
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import { contentType } from "mime-types";
import { disconnect } from "mongoose";



export default function ProductForm({
    _id,
    title:existingTitle,
    category:assignedCategory,
    properties:assignedProperties,
    description:existingDescription,
    price:existingPrice,
    images:existingImages,
}) {
    const [title, setTitle]= useState(existingTitle || '');
    const [category, setCategory]= useState(assignedCategory || '');
    const [productProperties, setProductProperties] = useState(assignedProperties || {});
    const [description,setDescription]= useState(existingDescription || '');
    const [price, setPrice]= useState(existingPrice || '');
    const [images, setImages]=useState(existingImages || []);
    const [goToProducts,setGoToProducts]=useState(false);
    const [isUploading, setIsUploading]= useState(false);
    const router= useRouter();
    const [categories, setCategories]=useState([]);

    useEffect(()=>{
        axios.get('/api/categories').then(result => {
           setCategories(result.data);
        })
    }, []);

    async function saveProduct(ev){
        ev.preventDefault();
        const data = {title, description, price,images,category,properties: productProperties};
        if (_id) {
            //update 
            
            await axios.put('/api/products', {...data,_id});
        } else {
            //create the product
           
        await axios.post('/api/products', data);
        
        }
        setGoToProducts(true);
        
    }

if(goToProducts){
    router.push('/products');
}


async function uploadImages(ev){
    //hiq nga komenti pasi ke rregulluer s3 budget
   /* 
   const files=ev.target?.files;
    if(files?.length > 0){
setIsUploading(true);
const data=new FormData();
for (const file of files){
    data.append('file', file);
}
const res= await axios.post('/api/upload', data);
setImages(oldImages = {
    return [...oldImages, ...res.data.links];
});
setIsUploading(false);   
}
*/

}

function updateImagesOrder(images){
setImages(images);
}

const propertiesToFill =[];
if (categories.length > 0 && category) {
    let categoryInfo =categories.find(({_id}) => _id === category);
    propertiesToFill.push(...categoryInfo.properties);
    while(categoryInfo?.parent?._id) {
        const parentCategory = categories.find(({_id}) => _id === categoryInfo?.parent?._id);
        propertiesToFill.push(...parentCategory.properties);
        categoryInfo=parentCategory;
    }
}

function setProductProp(propname,value){
    setProductProperties(prev => {
        const newProductProps = {...prev};
        newProductProps[propname] = value;
        return newProductProps;
    });
}

return (
    <form onSubmit={saveProduct}>
        <label>Product Name *</label>
        <input type="text" 
        placeholder="Product name" 
        value={title} 
        onChange={ev => setTitle(ev.target.value)}/>

        <label>Category</label>
        <select value={category} onChange={ev=>setCategory(ev.target.value)}>
            <option value="">Uncategorized</option>
            {categories.length>0 && categories.map(c => (
                <option value={c._id}>{c.name}</option>
            ))}
            
        </select>
        
        {propertiesToFill.length > 0 && propertiesToFill.map( p=> (
         <div key={p.name} className="">
            <label>{p.name[0].toUpperCase()+p.name.substring(1)}</label>
            <div>
                <select 
                value={productProperties[p.name]}
                onChange={ev=>setProductProp(p.name,ev.target.value)}>
                <option value="" disabled selected>Choose a {p.name}</option>
                {p.values.map(v => (
                    <option key={v} value={v}>{v}</option>
                ))}
            </select>
            </div>
            
            
        </div>
        
        ))}
        

        <label>Photos</label>
        <div className="mb-2 flex flex-wrap gap-1">
            <ReactSortable 
            list={images} 
            className="flex flex-wrap gap-1"
            setList={updateImagesOrder}>
        {!!images?.length && images.map(link => (
            <div key={link} className="h-24 bg-white p-4s shadow-sm rounded-sm border border-gray-200">
            <img scr={link} alt="" className="rounded-lg"/>
            </div>
        ))}
        </ReactSortable>
        
        {isUploading && (
            <div className="h-24 flex items-center">
                <Spinner/>
            </div>
        )}
        <label className="cursor-pointer bg-white shadow-sm flex-col text-sm gap-1 text-cyan-900  rounded-sm w-24 h-24 text-center flex items-center justify-center border border-cyan-900">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
</svg>
<div>Add image</div>
            <input type="file" className="hidden" onChange={uploadImages}></input>
 
            </label>
        </div>


        <label>Description</label>
        <textarea placeholder="Description"
        value={description} 
        onChange={ev => setDescription(ev.target.value)}
        ></textarea>     
    
        <label>Price (in €) *</label>
        <input type="number" placeholder="Price"
        value={price} 
        onChange={ev => setPrice(ev.target.value)}
        />
        
        <button 
        type="submit" 
        className="btn-primary">Save</button>

    </form>
);
}
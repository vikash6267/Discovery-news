import React, { useEffect, useState } from 'react'
import { getSingleNews } from '../services/operations/admin'
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { FaClock } from 'react-icons/fa';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

function SingleNews() {
    const [news, setNews] = useState({});
    const [loading, setLoading] = useState(false);
    const { id } = useParams();

   
    useEffect(() => {
        const fetchNews = async () => {
          setLoading(true);
          try {
            const response = await getSingleNews(id);
            setNews(response);
            console.log(response)
    
       
          } catch (error) {
            console.error("Error fetching news:", error);
          }
          setLoading(false);
        };
        fetchNews();
      }, [id]);


      const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          return "Invalid date";
        }
        return format(date, "MMMM d, yyyy h:mm a");
      };
  return (
<div className=' max-w-7xl mx-auto p-4'>
<div className=' flex '>



{/* News Details */}
<div className=' lg:w-[75%]  w-full '>

    {/* UP */}

    <div>
  <div>
  <p className=' font-semibold text-2xl font-sans'>{news?.title}</p>
  <p>{news?.createdAt ? formatDate(news.createdAt) : "Date not available"}</p>

  </div>
  
  <div className="flex space-x-4 mt-4">
        <a href={`https://facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noopener noreferrer" className=' p-2 bg-blue-800 rounded-lg'>
          <FaFacebookF className='  text-white' />
        </a>
        <a href={`https://twitter.com/intent/tweet?url=${window.location.href}`} target="_blank" rel="noopener noreferrer" className='p-2 bg-blue-500 rounded-lg'>
          <FaTwitter className='text-white' />
        </a>
        <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}`} target="_blank" rel="noopener noreferrer" className='p-2 bg-blue-400 rounded-lg'>
          <FaLinkedinIn className='text-blue-700' />
        </a>
        <a href={`https://wa.me/?text=${window.location.href}`} target="_blank" rel="noopener noreferrer" className='p-2 bg-green-600 rounded-lg'>
          <FaWhatsapp className='text-white' />
        </a>
        <a href={`mailto:?subject=Check this out&body=${window.location.href}`} target="_blank" rel="noopener noreferrer" className='p-2 bg-gray-600 rounded-lg'>
          <FaEnvelope className='text-gray-100' />
        </a>
      </div>

    </div>

    {/* down */}
    <div className=' '>

<div className=' '>
{
    news?.images?.map((imge,index)=>(
<img src={imge?.url} alt="" key={index}  className=' '/>
    ))
}
</div>



<span className=' font-semibold text-xl underline inline-block bg-red-600'>{news?.location} {" -"}</span>
<span
                dangerouslySetInnerHTML={{ __html: news?.description }}
             className=' ' ></span>




    </div>
</div>



{/* New News */}
<div className=' lg:w-[23%]'>

</div>
</div>
</div>
  )
}

export default SingleNews
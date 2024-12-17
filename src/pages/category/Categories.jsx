import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from '../../redux/categorySlice'; // Adjust path as needed
import { CaretLeft, CaretRight } from 'phosphor-react'; // Importing Phosphor icons

const Categories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, loading, error } = useSelector((state) => state.categories);
  const sliderRef = useRef(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="categories">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>

      {loading && <p>Loading categories...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="relative">
        {/* Scroll Buttons */}
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 text-white p-2 rounded-full flex items-center justify-center"
          onClick={scrollLeft}
        >
          <CaretLeft size={16} weight="bold" />
        </button>
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 text-white p-2 rounded-full flex items-center justify-center"
          onClick={scrollRight}
        >
          <CaretRight size={16} weight="bold" />
        </button>

        {/* Category Slider */}
        <div
          ref={sliderRef}
          className="category-slider flex gap-4 overflow-x-scroll no-scrollbar"
          style={{
    scrollBehavior: 'smooth',
    scrollbarWidth: 'none', // For Firefox
    msOverflowStyle: 'none', // For Internet Explorer
  }}
        >
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category._id}
                className=" bg-[#100417] shadow-md rounded-full p-2 cursor-pointer flex-shrink-0 flex items-center  justify-center gap-4"
                onClick={() => navigate(`/category/${category._id}`)}
              >
                <p className="font-semibold">{category.name}</p>

                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                  <img
                    src={category.image.url}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))
          ) : (
            <p>No categories found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;

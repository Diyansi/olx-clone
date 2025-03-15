import { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Categories from "./Categories";
import { FaHeart } from "react-icons/fa";
import "./Home.css";
import API_URL from "../constants";


// Default Products List
const defaultProducts = [
  {
    _id: "bike",
    pname: "Royal Enfield",
    category: "Bikes",
    price: " ₹1,73,000 ",
    pdesc: "SG Highway, Ahmedabad.",
    pimage: "/logo/b.jpeg",
  },
  {
    _id: "default-2",
    pname: "Iphone 12",
    category: "Mobiles",
    price: "₹1,299",
    pdesc: "This is product 2 description.",
    pimage: "./logo/m.jpg",
  },
  {
    _id: "default-3",
    pname: "Man's cloth",
    category: "Cloth",
    price: "₹499",
    pdesc: "Radhanpur Road, Mehsana.",
    pimage: "./logo/cm1.jpeg",
  },
  {
    _id: "default-4",
    pname: "2 BHK plot",
    category: "Plots",
    price: "₹60Lakh",
    pdesc: "Gota, Ahmedabad.",
    pimage: "./logo/p.jpeg",
  },
  {
    _id: "default-5",
    pname: "Grocery",
    category: "Sale",
    price: "50% OFF",
    pdesc: "Shankheshwar Road,visnagar.",
    pimage: "./logo/s.jpeg",
  },
  {
    _id: "default-6",
    pname: "2 BHK flat",
    category: "Rent",
    price: "₹17000/M",
    pdesc: "Modhera Road,mEHSANA.",
    pimage: "./logo/r.jpeg",
  },
  {
    _id: "default-7",
    pname: "Boat Headphone",
    category: "Headphone",
    price: "₹3,999",
    pdesc: "Manav Ashram,Mehsana.",
    pimage: "./logo/h.jpg",
  },
  {
    _id: "default-8",
    pname: "Asus Vivobook",
    category: "Laptops",
    price: "₹1Lakh",
    pdesc: "Sidhpur Road,Patan.",
    pimage: "./logo/lap.jpeg",
  },
  {
    _id: "default-9",
    pname: "Cemera",
    category: "Electronics",
    price: "₹8,500",
    pdesc: "Sherpura,Patan.",
    pimage: "./logo/e.jpeg",
  },
  {
    _id: "default-10",
    pname: "Vikrant",
    category: "Bikes",
    price: "₹66,448",
    pdesc: "SG Highway, Ahmedabad.",
    pimage: "./logo/bb.jpeg",
  },
];

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cproducts, setCProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [likedProducts, setLikedProducts] = useState({}); // Like state

  useEffect(() => {
    const url = API_URL + "/get-products";
    axios
      .get(url)
      .then((res) => {
        if (res.data.products) {
          setProducts(res.data.products.reverse()); // Reverse order for new products first
        }
      })
      .catch(() => {
        alert("Server Error");
      });
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleClick = () => {
    const url = API_URL + "/search?search=" + search + "&loc=" + localStorage.getItem("userLoc");
    axios
      .get(url)
      .then((res) => {
        setCProducts(res.data.products);
        setIsSearch(true);
      })
      .catch(() => {
        alert("Server Error");
      });
  };

  const handleCategory = (value) => {
    const filteredProducts = products.filter((item) => item.category === value);
    setCProducts(filteredProducts);
  };

  const handleLike = (productId, isDefault) => {
    if (isDefault) {
      setLikedProducts((prev) => ({ ...prev, [productId]: !prev[productId] }));
    } else {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Please Login first.");
        return;
      }

      const url = API_URL + "/like-product";
      const data = { userId, productId };
      axios
        .post(url, data)
        .then(() => {
          alert("Liked.");
        })
        .catch(() => {
          alert("Server Error");
        });
    }
  };

  const handleProduct = (id) => {
    navigate("/product/" + id);
  };

  return (
    <div>
      <Header search={search} handlesearch={handleSearch} handleClick={handleClick} />
      <Categories handleCategory={handleCategory} />

      {isSearch && cproducts && (
        <h5 className="fix">
          SEARCH RESULTS
          <button className="clear-btn" onClick={() => setIsSearch(false)}>
            CLEAR
          </button>
        </h5>
      )}

      {isSearch && cproducts.length === 0 && <h5>No Results Found</h5>}

      {/* Search Results */}
      {isSearch && (
        <div className="d-flex justify-content-center flex-wrap">
          {cproducts.map((item) => (
            <div key={item._id} className="card m-3">
              <div onClick={() => handleLike(item._id, false)} className="icon-con">
                <FaHeart className={`icons ${likedProducts[item._id] ? "liked" : ""}`} />
              </div>
              <img width="250px" height="150px" src={API_URL + "/" + item.pimage} alt={item.pname} />
              <h3 className="m-2 price-text">Rs. {item.price} /-</h3>
              <p className="m-2">{item.pname} | {item.category}</p>
              <p className="m-2 text-success">{item.pdesc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Non-Default Products First, Then Default Products */}
      {!isSearch && (
        <div className="d-flex justify-content-center flex-wrap">
          {/* पहले Non-default products */}
          {products.map((item) => (
            <div key={item._id} className="card m-3" onClick={() => handleProduct(item._id)}>
              <div onClick={(e) => { e.stopPropagation(); handleLike(item._id, false); }} className="icon-con">
                <FaHeart className={`icons ${likedProducts[item._id] ? "liked" : ""}`} />
              </div>
              <img
                width="250px"
                height="150px"
                src={API_URL + "/" + item.pimage}
                alt={item.pname}
              />
              <h3 className="m-2 price-text">Rs. {item.price} /-</h3>
              <p className="m-2">{item.pname} | {item.category}</p>
              <p className="m-2 text-success">{item.pdesc}</p>
            </div>
          ))}

          {/* फिर Default products */}
          {defaultProducts.map((item) => (
            <div key={item._id} className="card m-3" onClick={() => handleProduct(item._id)}>
              <div onClick={(e) => { e.stopPropagation(); handleLike(item._id, true); }} className="icon-con">
                <FaHeart className={`icons ${likedProducts[item._id] ? "liked" : ""}`} />
              </div>
              <img
                width="250px"
                height="150px"
                src={item.pimage}
                alt={item.pname}
              />
              <h3 className="m-2 price-text">Rs. {item.price} /-</h3>
              <p className="m-2">{item.pname} | {item.category}</p>
              <p className="m-2 text-success">{item.pdesc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;

import { useEffect, useState } from "react";
import axios from "axios";
import ProductItem from "./ProductItem";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { changeAuthPageState } from "../AppSlice";
import getCategories from "../functions/getCategories";
import verifyToken from "../functions/verifyToken";
import saveItemToCart from "../functions/saveItemToCart";
import getProducts from "../functions/getProductItems";

export default function MenuPage() {
  const [categories, setCategories] = useState<any>([]);
  const [products, setProducts] = useState<any>([]);
  const [showLoader, setShowLoader] = useState(false);
  const dispatch = useDispatch();
  const authCheck = useSelector((state: RootState) => {
    return state.appReducer.checkUserAuth;
  });
  const [category, setCategory] = useState({
    // cones : 'cones',
    // cups : 'cups'
  });

  useEffect(() => {
    try {
      setShowLoader(true);
      getCategories().then((res) => {
        setCategories(res);
        setShowLoader(false);
        console.log("state changed");
      });
    } catch (error) {
      setShowLoader(false);
      console.error("unable to get categories", error);
    }
  }, []);

  useEffect(() => {
    try {
      setShowLoader(true);
      getProducts(setProducts);
    } catch (error) {
      setShowLoader(false);
      console.log(error);
    }
  }, []);

  function checkIfUserLoggedIn(itemName: string, itemId: string): any {
    if (authCheck === "not logged in") {
      dispatch(changeAuthPageState("animate-slideDown"));
    } else {
      console.log(itemName + " order placed");
      jwtVerify(itemId);
    }
  }
  const jwtVerify = async (itemId: string) => {
    const email = await verifyToken(authCheck);
    saveItemToCart(email, itemId);
  };

  if (showLoader) {
    console.log("...loading");
    return <div>loading...</div>;
  }

  return (
    <div className="mt-3 ml-10 lg:ml-20">
      {categories.map((item: any, index: number) => {
        return (
          <section className="w-fit h-fit " key={index}>
            <div className="flex">
              <div className="w-fit h-fit flex my-1">
                <h1 className="font-semibold relative text-xl z-10 my-1">
                  {item.category}
                </h1>
                <div className="bg-[#ff4a60] w-16 ml-[-2.3em]"></div>
              </div>
              <div className="w-32 h-1 bg-[#CBCBCB] my-auto rounded-full ml-5"></div>
            </div>
            <div>
              <ul className="inline-block w-full ml-3 my-0 mb-10">
                {products.length &&
                  products
                    .filter((product) => product.category === item.category)
                    .map((item, index) => {
                      return (
                        <li key={index} className="inline-block">
                          <ProductItem
                            iceName={item.iceName}
                            price={item.price}
                            color={item.color}
                            onAddToCartClick={() => {
                              checkIfUserLoggedIn(item.iceName, item._id);
                            }}
                          />
                        </li>
                      );
                    })}
              </ul>
            </div>
          </section>
        );
      })}
    </div>
  );
}

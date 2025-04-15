import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/redux/hooks";
import { clearCart } from "@/redux/slices/cartSlice";
import { useSnackbarContext } from "@/redux/context/SnackBarContext";
import api from "@/utils/api";
import {
  Home,
  ChevronRight,
  CreditCard,
  DollarSign,
  Banknote,
} from "lucide-react";
import Button from "@/components/Button";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  total_price: number;
  images: string[];
}

interface CheckoutPageProps {
  cartItems: CartItem[];
  totalAmount: number;
}

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  region: string;
  companyName?: string;
  streetAddress: string;
  apartment?: string;
  email?: string;
  saveInfo: boolean;
  paymentMethod: string;
}

const CheckoutPage = ({ cartItems, totalAmount }: CheckoutPageProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { showMessage } = useSnackbarContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      paymentMethod: "bank_transfer",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const orderData = {
        deliveryAddress: `${data.streetAddress}${
          data.apartment ? `, ${data.apartment}` : ""
        }`,
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        city: data.city,
        region: data.region,
      };

      await api.post("/orders", orderData);
      showMessage("Order placed successfully!", "success");
      dispatch(clearCart());
      router.push("/orders");
    } catch (error: any) {
      showMessage("Error placing order: " + error.message, "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="flex items-center hover:text-[#E07575]">
              <Home className="w-4 h-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link href="/profile" className="hover:text-[#E07575]">
              My Account
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link href="/cart" className="hover:text-[#E07575]">
              Cart
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-[#E07575]">Checkout</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold mb-6 pb-4 border-b">
                  Billing Details
                </h2>

                <div className="space-y-6">
                  <div className="relative">
                    <input
                      id="firstName"
                      {...register("firstName", {
                        required: "First name is required",
                      })}
                      className={`w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-[#E07575] transition ${
                        errors.firstName ? "border-red-500" : ""
                      }`}
                      placeholder=" First Name"
                    />

                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      id="lastName"
                      {...register("lastName", {
                        required: "Last name is required",
                      })}
                      className={`w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-[#E07575] transition ${
                        errors.lastName ? "border-red-500" : ""
                      }`}
                      placeholder=" Last Name "
                    />

                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      id="companyName"
                      {...register("companyName")}
                      className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-[#E07575] transition"
                      placeholder="Company Name"
                    />
                  </div>

                  <div className="relative">
                    <input
                      id="region"
                      {...register("region", {
                        required: "Region is required",
                      })}
                      className={`w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-[#E07575] transition ${
                        errors.lastName ? "border-red-500" : ""
                      }`}
                      placeholder="Region"
                    />
                    {errors.region && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.region.message}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      id="streetAddress"
                      {...register("streetAddress", {
                        required: "Street address is required",
                      })}
                      className={`w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-[#E07575] transition ${
                        errors.streetAddress ? "border-red-500" : ""
                      }`}
                      placeholder=" Street Address "
                    />
                    {errors.streetAddress && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.streetAddress.message}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      id="apartment"
                      {...register("apartment")}
                      className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-[#E07575] transition"
                      placeholder=" Apartment, floor, etc. "
                    />
                  </div>

                  <div className="relative">
                    <input
                      id="city"
                      {...register("city", { required: "City is required" })}
                      className={`w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-[#E07575] transition ${
                        errors.city ? "border-red-500" : ""
                      }`}
                      placeholder="Town/City"
                    />

                    {errors.city && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      id="phone"
                      {...register("phone", { required: "Phone is required" })}
                      className={`w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-[#E07575] transition ${
                        errors.phone ? "border-red-500" : ""
                      }`}
                      placeholder="Phone Number "
                    />

                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      {...register("email")}
                      className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-[#E07575] transition"
                      placeholder="Email adress "
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-6 pb-4 border-b">
                  Your Order
                </h2>

                <div className="border-b border-gray-200 pb-4 mb-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between py-3 border-b"
                    >
                      <div className="flex items-center">
                        {item.images?.[0] && (
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-10 h-10 rounded mr-3 object-cover"
                          />
                        )}
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                      </div>
                      <span>${Number(item.total_price || 0).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between pb-3 border-b">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-3">
                    <span>Total:</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-4 pb-2 border-b">
                    Payment Method
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center pb-3 border-b">
                      <input
                        id="bank_transfer"
                        type="radio"
                        value="bank_transfer"
                        {...register("paymentMethod")}
                        className="h-4 w-4 text-[#E07575] focus:ring-[#E07575] border-gray-300"
                      />
                      <label
                        htmlFor="bank_transfer"
                        className="ml-3 flex items-center"
                      >
                        <Banknote className="w-5 h-5 mr-2 text-blue-600" />
                        <span>Bank Transfer</span>
                      </label>
                    </div>
                    <div className="flex items-center pb-3 border-b">
                      <input
                        id="credit_card"
                        type="radio"
                        value="credit_card"
                        {...register("paymentMethod")}
                        className="h-4 w-4 text-[#E07575] focus:ring-[#E07575] border-gray-300"
                      />
                      <label
                        htmlFor="credit_card"
                        className="ml-3 flex items-center"
                      >
                        <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                        <span>Credit/Debit Card</span>
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="cod"
                        type="radio"
                        value="cod"
                        {...register("paymentMethod")}
                        className="h-4 w-4 text-[#E07575] focus:ring-[#E07575] border-gray-300"
                      />
                      <label htmlFor="cod" className="ml-3 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                        <span>Cash on Delivery</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mb-6 pb-4 border-b">
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-[#E07575] transition"
                      placeholder=" "
                    />
                    <label className="absolute left-4 top-3 text-gray-500 pointer-events-none transition-all duration-200 peer-focus:-translate-y-5 peer-focus:text-sm peer-focus:text-[#E07575] peer-placeholder-shown:translate-y-0 peer-[&:not(:placeholder-shown)]:-translate-y-5 peer-[&:not(:placeholder-shown)]:text-sm">
                      Coupon Code
                    </label>
                    <Button
                      variant="secondary"
                      size="md"
                      className="absolute right-0 top-0 rounded-l-none"
                    >
                      Apply
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Place Order"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    const { data } = await api.get("/cart", {
      headers: { cookie: req.headers.cookie || "" },
    });

    if (!data.items || data.items.length === 0) {
      return {
        redirect: {
          destination: "/cart",
          permanent: false,
        },
      };
    }

    return {
      props: {
        cartItems: data.items,
        totalAmount: data.totalAmount,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};

export default CheckoutPage;

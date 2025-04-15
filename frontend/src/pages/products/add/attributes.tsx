import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addProductAttributes } from "@/redux/slices/productsSlice";

import { ArrowLeft } from "lucide-react";
import ProductPreviewCard from "@/components/ui/product/ProductPreviewCard";
import AttributeForm from "@/components/ui/forms/AttributeForm";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

const AddAttributesPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { productId, subcategoryId } = router.query;
  const { error } = useAppSelector((state) => state.products);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const productIdNum = productId ? Number(productId) : NaN;
    const subcategoryIdNum = subcategoryId ? Number(subcategoryId) : NaN;

    if (isNaN(productIdNum) || isNaN(subcategoryIdNum)) {
      console.error("Invalid product or subcategory ID", {
        productId,
        subcategoryId,
      });
      router.push("/products/add");
    }
  }, [productId, subcategoryId, router]);

  const handleSubmit = async (
    attributes: { attribute_id: number; value: string }[]
  ) => {
    setIsSubmitting(true);

    const productIdNum = Number(productId);

    if (isNaN(productIdNum)) {
      setIsSubmitting(false);
      return;
    }

    try {
      await dispatch(
        addProductAttributes({
          productId: productIdNum,
          attributes,
        })
      ).unwrap();

      router.push(`/products/${productId}`);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbs = [
    { name: "My Products", href: "/seller/products" },
    { name: "Add Attributes", href: "#" },
  ];
  return (
    <h1 title="Добавление атрибутов">
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <div className="mb-6">
          <button
            onClick={() => router.push("/products/add")}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h3 className="font-medium text-gray-900 mb-4">
                Product Preview
              </h3>
              <ProductPreviewCard productId={Number(productId)} />
            </div>
          </div>

          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Add Attributes
                  </h1>
                  <p className="text-gray-500 mt-1">
                    Specify product characteristics
                  </p>
                </div>
                <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Step 2 of 2
                </div>
              </div>

              <AttributeForm
                productId={Number(productId)}
                subcategoryId={Number(subcategoryId)}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </h1>
  );
};

export default AddAttributesPage;

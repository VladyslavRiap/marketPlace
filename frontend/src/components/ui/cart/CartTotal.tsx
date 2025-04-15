import Button from "@/components/Button";

interface CartTotalProps {
  totalAmount: number;
  itemCount: number;
}

const CartTotal = ({ totalAmount, itemCount }: CartTotalProps) => (
  <div className="lg:w-full lg:max-w-md border border-gray-200 rounded-xl">
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-bold mb-6">Amount</h3>

      <div className="space-y-4">
        <div className="flex justify-between border-b pb-4">
          <span className="text-gray-600">total:</span>
          <span className="font-medium">${totalAmount.toFixed(2)}</span>
        </div>

        <div className="flex justify-between border-b pb-4">
          <span className="text-gray-600">Delivery:</span>
          <span className="font-medium">Free</span>
        </div>

        <div className="flex justify-between pt-4">
          <span className="text-lg font-bold">Total amount:</span>
          <span className="text-lg font-bold">${totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <Button
        href="/checkout"
        variant="secondary"
        size="lg"
        fullWidth
        className="mt-6"
        disabled={itemCount === 0}
      >
        Confirm order
      </Button>
    </div>
  </div>
);

export default CartTotal;

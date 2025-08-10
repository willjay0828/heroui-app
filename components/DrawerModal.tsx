import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
  Button,
  Input,
} from "@heroui/react";

// 让父组件可以通过ref调用handleOpen
const DrawerModal = forwardRef<{ handleOpen: () => void }, {}>((props, ref) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useImperativeHandle(ref, () => ({
    handleOpen: onOpen,
  }));

  const flavorList = [
    { type: 1, name: 'Oolong tea' },
    { type: 2, name: 'Electric Blue Razz' },
    { type: 3, name: 'Frosty Strawbreeze' }
  ];
  const [flavorActive, setFlavorActive] = useState(1);

  const nicotineList = [
    { type: 1, name: '0%' },
    { type: 2, name: '2%' }
  ];
  const [nicotineActive, setNicotineActive] = useState(1);

  // 新增数量 state，默认值为 0
  const [quantity, setQuantity] = useState(0);

  // 减少数量
  const handleDecrease = () => {
    setQuantity((prev) => (prev > 0 ? prev - 1 : 0));
  };
   // 增加数量
   const handleAdd = () => {
    setQuantity((prev) => prev + 1);
  };

  return (
    <Drawer isOpen={isOpen} placement="bottom" onOpenChange={onOpenChange}>
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="flex flex-col gap-1">Redeem Smart Pods</DrawerHeader>
            <DrawerBody>
              <p className="text-[#5F5F5F] text-[.8rem]">Flavor</p>
              <div className="flex flex-wrap gap-[.5rem]">
                {flavorList.map((flavor) => (
                  <Button
                    key={flavor.type}
                    className={`bg-[#212122] text-[#E6EBEC] w-[calc(50%-0.25rem)] border border-solid ${flavorActive === flavor.type ? "border-[#FF4C33] text-[#FF4C33]" : "border-[#212122]"}`}
                    radius="full"
                    onPress={() => setFlavorActive(flavor.type)}
                  >
                    {flavor.name}
                  </Button>
                ))}
              </div>
              <p className="text-[#5F5F5F] text-[.8rem] mt-2">Nicotine Level</p>
              <div className="flex flex-wrap gap-[.5rem]">
                {nicotineList.map((flavor) => (
                  <Button
                    key={flavor.type}
                    className={`bg-[#212122] text-[#E6EBEC] w-[calc(50%-0.25rem)] border border-solid ${nicotineActive === flavor.type ? "border-[#FF4C33] text-[#FF4C33]" : "border-[#212122]"}`}
                    radius="full"
                    onPress={() => setNicotineActive(flavor.type)}
                  >
                    {flavor.name}
                  </Button>
                ))}
              </div>
              <p className="text-[#5F5F5F] text-[.8rem] mt-2">Quantity</p>
              <Input
                className="w-full cal-input"
                startContent={
                  <button className="w-8 h-full text-[1rem]" onClick={handleDecrease}>-</button>
                }
                endContent={
                  <button className="w-8 h-full text-[1rem]" onClick={handleAdd}>+</button>
                }
                type="text"
                size="lg"
                value={quantity.toString()}
              />
              <p className="flex items-center gap-1 text-[.8rem]">
                <img src="/images/box.svg" alt="box" className="inline-block w-3 h-3" /> 
                <span className='text-[#747474]'>Inventory:</span> 100
              </p>
            </DrawerBody>
            <DrawerFooter>
              <Button radius="full" className="w-full bg-[#FF4C33] text-white h-[2.2rem]" onPress={onClose}>
                Confirm
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
});

DrawerModal.displayName = "DrawerModal";
export default DrawerModal;
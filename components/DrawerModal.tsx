import React, { forwardRef, useImperativeHandle, useState, useCallback, memo } from "react";
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

// 常量抽离
const FLAVOR_LIST = [
  { type: 1, name: 'Oolong tea' },
  { type: 2, name: 'Electric Blue Razz' },
  { type: 3, name: 'Frosty Strawbreeze' }
];

const NICOTINE_LIST = [
  { type: 1, name: '0%' },
  { type: 2, name: '2%' }
];

const INVENTORY = 100;

const DrawerModal = forwardRef<{ handleOpen: () => void }, {}>((props, ref) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useImperativeHandle(ref, () => ({
    handleOpen: onOpen,
  }), [onOpen]);

  const [flavorActive, setFlavorActive] = useState(FLAVOR_LIST[0].type);
  const [nicotineActive, setNicotineActive] = useState(NICOTINE_LIST[0].type);
  const [quantity, setQuantity] = useState(0);

  // 优化回调
  const handleDecrease = useCallback(() => {
    setQuantity(prev => Math.max(prev - 1, 0));
  }, []);

  const handleAdd = useCallback(() => {
    setQuantity(prev => prev + 1);
  }, []);

  // flavor/nicotine 按钮渲染抽离
  const renderOptionButtons = useCallback(
    (
      list: { type: number; name: string }[],
      active: number,
      setActive: React.Dispatch<React.SetStateAction<number>>
    ) => (
      <div className="flex flex-wrap gap-[.5rem]">
        {list.map((item) => (
          <Button
            key={item.type}
            className={`bg-[#212122] text-[#E6EBEC] w-[calc(50%-0.25rem)] border border-solid ${
              active === item.type ? "border-[#FF4C33] text-[#FF4C33]" : "border-[#212122]"
            }`}
            radius="full"
            onPress={() => setActive(item.type)}
          >
            {item.name}
          </Button>
        ))}
      </div>
    ),
    []
  );

  return (
    <Drawer isOpen={isOpen} placement="bottom" onOpenChange={onOpenChange}>
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="flex flex-col gap-1">
              Redeem Smart Pods
            </DrawerHeader>
            <DrawerBody>
              <p className="text-[#5F5F5F] text-[.8rem]">Flavor</p>
              {renderOptionButtons(FLAVOR_LIST, flavorActive, setFlavorActive)}
              <p className="text-[#5F5F5F] text-[.8rem] mt-2">Nicotine Level</p>
              {renderOptionButtons(NICOTINE_LIST, nicotineActive, setNicotineActive)}
              <p className="text-[#5F5F5F] text-[.8rem] mt-2">Quantity</p>
              <Input
                className="w-full cal-input"
                startContent={
                  <button
                    className="w-8 h-full text-[1rem]"
                    onClick={handleDecrease}
                    type="button"
                  >
                    -
                  </button>
                }
                endContent={
                  <button
                    className="w-8 h-full text-[1rem]"
                    onClick={handleAdd}
                    type="button"
                  >
                    +
                  </button>
                }
                type="text"
                size="lg"
                value={quantity.toString()}
                readOnly
              />
              <p className="flex items-center gap-1 text-[.8rem]">
                <img src="/images/box.svg" alt="box" className="inline-block w-3 h-3" />
                <span className="text-[#747474]">Inventory:</span> {INVENTORY}
              </p>
            </DrawerBody>
            <DrawerFooter>
              <Button
                radius="full"
                className="w-full bg-[#FF4C33] text-white h-[2.2rem]"
                onPress={onClose}
              >
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
export default memo(DrawerModal);
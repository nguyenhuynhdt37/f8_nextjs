import React from 'react';
import { Form, Input, Radio, Alert } from 'antd';
import { FiDollarSign } from 'react-icons/fi';

interface CoursePriceProps {
  data: {
    isFree: boolean;
    price?: number;
    priceOld?: number;
  };
  setData: React.Dispatch<React.SetStateAction<any>>;
  error: any;
  setError: React.Dispatch<React.SetStateAction<any>>;
}

const CoursePrice: React.FC<CoursePriceProps> = ({ data, setData, error, setError }) => {
  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError({
      ...error,
      [e.target.name]: '',
    });

    const newValue = e.target.value;
    if (/^\d*$/.test(newValue)) {
      setData((prevData: any) => ({
        ...prevData,
        [e.target.name]: newValue ? parseInt(newValue) : undefined,
      }));
    }
  };

  const handleRadioChange = (e: any) => {
    const isFree = e.target.value === 'free';
    setData({
      ...data,
      isFree,
      // Reset price values if switching to free
      ...(isFree ? { price: undefined, priceOld: undefined } : {})
    });

    // Clear errors if switching to free
    if (isFree) {
      setError({
        ...error,
        price: undefined,
        priceOld: undefined
      });
    }
  };

  return (
    <div>
      <Form layout="vertical">
        <Form.Item label="Loại khóa học">
          <Radio.Group
            value={data.isFree ? 'free' : 'paid'}
            onChange={handleRadioChange}
            className="flex flex-wrap gap-6"
          >
            <Radio value="free" className="text-base">Miễn phí</Radio>
            <Radio value="paid" className="text-base">Trả phí</Radio>
          </Radio.Group>
        </Form.Item>

        {!data.isFree && (
          <>
            <Alert
              message="Lưu ý về giá khóa học"
              description="Giá hiện tại là giá chính xác khi khách hàng thanh toán, giá hiện tại phải nhỏ hơn giá gốc để tạo khuyến mãi."
              type="warning"
              showIcon
              className="mb-4"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item
                label="Giá khuyến mãi (VNĐ)"
                validateStatus={error?.price ? 'error' : ''}
                help={error?.price}
                required
              >
                <Input
                  name="price"
                  value={data.price || ''}
                  onChange={handleOnchange}
                  placeholder="Nhập giá khuyến mãi"
                  prefix={<FiDollarSign className="text-gray-400" />}
                  suffix="VNĐ"
                  className="py-2"
                />
              </Form.Item>

              <Form.Item
                label="Giá gốc (VNĐ)"
                validateStatus={error?.priceOld ? 'error' : ''}
                help={error?.priceOld}
                required
              >
                <Input
                  name="priceOld"
                  value={data.priceOld || ''}
                  onChange={handleOnchange}
                  placeholder="Nhập giá gốc"
                  prefix={<FiDollarSign className="text-gray-400" />}
                  suffix="VNĐ"
                  className="py-2"
                />
              </Form.Item>
            </div>

            {data.price && data.priceOld && parseInt(data.price.toString()) >= parseInt(data.priceOld.toString()) && (
              <Alert
                message="Giá khuyến mãi phải nhỏ hơn giá gốc"
                type="error"
                showIcon
                className="mt-2"
              />
            )}
          </>
        )}
      </Form>
    </div>
  );
};

export default CoursePrice;

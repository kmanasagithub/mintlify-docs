import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaCircleArrowRight } from 'react-icons/fa6';
import { FiPlus } from 'react-icons/fi';
import { ImBin } from 'react-icons/im';
import { CustomForm } from '../FormBuilder';
import { Form } from 'react-bootstrap';
import {
  formElements3rd,
  formElements31rd,
  formElements4th,
  formElements5th,
} from './FormBuilds';
import { form3Schema, form4Schema, form5Schema } from './Schema';
import { useDispatch, useSelector } from 'react-redux';
import {
  addAddress,
  removeAddress,
  selectAddress,
  removeSelectedAddress,
} from './index.slice';

export type IconTextProps = {
  children?: React.ReactNode;
  icon: React.ReactNode;
};

export interface Address {
  id: string;
  sub: string;
  lab: string;
  view: boolean;
}

export function IconText({ children, icon }: IconTextProps) {
  return (
    <div className="icon-text">
      <div>{icon}</div>
      <>{children}</>
    </div>
  );
}

export type GetAddressTemplateProps = {
  header?: string;
  selAddr?: string;
  req?: boolean;
  setSelectedAddresses?: (Address: Address[]) => void | undefined;
  selectedAddresses?: Address[];
  Address?: Address;
  defaultAdress?: any;
};

export const GetAddressTemplate = React.forwardRef(function (
  {
    header,
    selAddr,
    req,
    setSelectedAddresses,
    selectedAddresses,
    Address,
    defaultAdress,
  }: GetAddressTemplateProps,
  ref: any
) {
  const [addressForms, setAddressForms] = useState<any[]>([
    { ref: React.createRef() },
  ]);
  const form3Ref: any = React.useRef<any>();
  const form4Ref: any = React.useRef<any>();
  const form5Ref: any = React.useRef<any>();

  const dispatch = useDispatch();
  const addressList = useSelector((state: any) => state.address.Addresses);
  const [selectedAddress, setSelectedAddress] = React.useState<any>(selAddr);
  const [addressMode, setAddressMode] = React.useState<any>(true);

  useEffect(() => {
    dispatch(
      addAddress({
        key: header as string,
        address: {
          ...addressList.defaultAddress,
        },
      })
    );
    if (header !== 'Ship From')
      dispatch(removeSelectedAddress(header as string));
  }, []);

  const addAddressForm = () => {
    setAddressForms([...addressForms, { ref: React.createRef() }]);
  };

  const handleCombinedSubmit2 = async () => {
    if (selectedAddress === 'DEFAULT') {
      dispatch(
        addAddress({
          key: header as string,
          address: {
            ...addressList.defaultAddress,
          },
        })
      );
      dispatch(selectAddress(header as string));
    } else if (selectedAddress === 'OTHER' && addressMode === true) {
      try {
        // Validate main address form
        const form3Valid = await form3Ref.current?.triggerValidation();
        // Validate all additional address forms
        const additionalFormsValidations = await Promise.all(
          addressForms.map((form) => form.ref.current?.triggerValidation())
        );
        const allAdditionalFormsValid =
          additionalFormsValidations.every(Boolean);

        // Validate the final form
        const form4Valid = await form4Ref.current?.triggerValidation();

        if (form3Valid && allAdditionalFormsValid && form4Valid) {
          // Get main address data
          const formData3 = await form3Ref.current.getValues();

          // Get all additional addresses data
          const additionalAddressesData = await Promise.all(
            addressForms.map((form) => form.ref.current.getValues())
          );

          // Get final form data
          const formData4 = await form4Ref.current.getValues();

          const combinedData = {
            ...formData3,
            additionalAddresses: additionalAddressesData,
            ...formData4,
          };
          dispatch(
            addAddress({
              key: header as string,
              address: combinedData,
            })
          );
          dispatch(selectAddress(header as string));
        }
      } catch (error) {
        console.error('Error validating or collecting form data:', error);
      }
    } else {
      const form5Valid = await form5Ref.current?.triggerValidation();
      if (form5Valid) {
        const formData5 = await form5Ref.current.getValues();
        dispatch(
          addAddress({
            key: header as string,
            address: formData5,
          })
        );
        dispatch(selectAddress(header as string));
      }
    }
  };

  function removeFromStore(arg0: string): any {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="sales-inv-box">
      <div style={{ height: '72px' }}>
        <h2 className="h2_label">{header}</h2>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '40%',
          justifyContent: 'space-between',
        }}
      >
        {req && (
          <IconText icon={<ImBin />}>
            <p
              className="linkFtext"
              onClick={() => {
                if (setSelectedAddresses && selectedAddresses && Address) {
                  setSelectedAddresses([
                    ...selectedAddresses.filter(
                      (value: Address) => value.id !== Address.id
                    ),
                    {
                      id: Address.id,
                      sub: Address.sub,
                      lab: Address.lab,
                      view: false,
                    },
                  ]);
                  dispatch(removeFromStore(header as string));
                }
              }}
            >
              Remove
            </p>
          </IconText>
        )}
      </div>
      <Form.Group className="mb-3 flex-item">
        <Form.Label className={`labelF`}>Location</Form.Label>
        <Form.Control
          as="select"
          className="inputF"
          style={{ width: '87%' }}
          value={selectedAddress}
          onChange={(e: any) => {
            setSelectedAddress(e.target.value);
            if (e.target.value === 'OTHER') {
              setAddressMode(true);
            } else {
              setAddressMode(false);
              dispatch(
                addAddress({
                  key: header as string,
                  address: {
                    address: '5678 main avenue',
                    city: 'Long Beach',
                    state: 'CA',
                    country: 'USA',
                    zip_code: '90802',
                  },
                })
              );
            }
          }}
        >
          {['DEFAULT', 'OTHER'].map((name, i) => (
            <option key={i} value={name}>
              {name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      {selectedAddress === 'DEFAULT' ? (
        <div className="address-block">
          <h3 className="h3_label">Address</h3>
          <div className="address-line">{defaultAdress.address}</div>
          <div className="address-line">
            {defaultAdress.city}, {defaultAdress.state}, {defaultAdress.country}
          </div>
          <div className="address-line">{defaultAdress.zip_code}</div>
        </div>
      ) : (
        <div className="mb-3 flex-item">
          {addressMode ? (
            <>
              <CustomForm
                elements={formElements31rd}
                dir="column"
                wid="87%"
                schema={form3Schema}
                ref={form3Ref}
              />
              {addressForms.map((form, index) => (
                <>
                  <CustomForm
                    key={index}
                    elements={formElements3rd}
                    dir="column"
                    wid="87%"
                    ref={form.ref}
                  />
                </>
              ))}
              <IconText icon={<FiPlus />}>
                <p className="linkFtext" onClick={addAddressForm}>
                  Address line
                </p>
              </IconText>
              <CustomForm
                elements={formElements4th}
                dir="column"
                wid="87%"
                schema={form4Schema}
                ref={form4Ref}
              />
            </>
          ) : (
            <CustomForm
              elements={formElements5th}
              dir="column"
              wid="87%"
              schema={form5Schema}
              ref={form5Ref}
            />
          )}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'left',
              alignItems: 'flex-start',
              width: '87%',
            }}
          >
            <Button type="submit" size="sm" onClick={handleCombinedSubmit2}>
              Validate address
            </Button>
            <Button
              variant="link"
              style={{ textDecoration: 'none', marginLeft: '-15px' }}
              onClick={() => setAddressMode(!addressMode)}
            >
              {addressMode === false
                ? 'I want to use a street address'
                : 'I want to use a lat/long coordinates'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});

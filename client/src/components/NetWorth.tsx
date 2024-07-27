import React, { useMemo, useState } from 'react';
import DataTable from './DataTable';
import { currencyFilter, pluralize } from '../util';
import { AccountType, AssetType } from './types';
import { useAssets } from '../services';

interface Props {
  numOfItems: number;
  accounts: AccountType[];
  personalAssets: AssetType[];
  userId: number;
  assetsOnly: boolean;
}

const calculateSums = (accounts: AccountType[]) => {
  const addAllAccounts = (accountSubtypes: Array<AccountType['subtype']>): number =>
    accounts
      .filter(a => accountSubtypes.includes(a.subtype))
      .reduce((acc, val) => acc + val.current_balance, 0);

  return {
    depository: addAllAccounts(['checking', 'savings', 'cd', 'money market']),
    investment: addAllAccounts(['ira', '401k']),
    loan: addAllAccounts(['student', 'mortgage']),
    credit: addAllAccounts(['credit card']),
  };
};

const NetWorth: React.FC<Props> = (props) => {
  const { deleteAssetByAssetId, addAsset } = useAssets();

  const { depository, investment, loan, credit } = useMemo(
    () => calculateSums(props.accounts),
    [props.accounts]
  );

  const personalAssetValue = useMemo(
    () => props.personalAssets.reduce((a, b) => a + b.value, 0),
    [props.personalAssets]
  );

  const assets = useMemo(() => depository + investment + personalAssetValue, [depository, investment, personalAssetValue]);
  const liabilities = useMemo(() => loan + credit, [loan, credit]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddForm(false);
    addAsset(props.userId, description, parseFloat(value));
    setDescription('');
    setValue('');
  };

  const handleAddAsset = () => {
    setShowAddForm(true);
  };

  const handleDeleteAsset = (assetId: number) => {
    deleteAssetByAssetId(assetId, props.userId);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
  };

  const assetData = useMemo(() => {
    const nonDeletableAssets = props.personalAssets.filter(asset => !['depository', 'investment'].includes(asset.type));
    const deletableAssets = props.personalAssets.filter(asset => ['depository', 'investment'].includes(asset.type));

    return [
      { id: -1, description: 'Depository', value: currencyFilter(depository), canDelete: false },
      { id: -1, description: 'Investment', value: currencyFilter(investment), canDelete: false },
      ...nonDeletableAssets.map(asset => ({
        id: asset.id,
        description: asset.description,
        value: currencyFilter(asset.value),
        canDelete: true
      })),
      ...deletableAssets.map(asset => ({
        id: asset.id,
        description: asset.description,
        value: currencyFilter(asset.value),
        canDelete: true
      }))
    ];
  }, [props.personalAssets, depository, investment]);

  const liabilityData = useMemo(() => [
    { id: -1, description: 'Credit Cards', value: currencyFilter(credit), canDelete: false },
    { id: -1, description: 'Loans', value: currencyFilter(loan), canDelete: false }
  ], [credit, loan]);

  const columns = useMemo(() => [
    { Header: 'Description', accessor: 'description' },
    { Header: 'Value', accessor: 'value' }
  ], []);

  return (
    <div className="netWorthContainer">
      <h2 className="netWorthHeading">Net Worth</h2>
      <h4 className="tableSubHeading">
        A summary of your assets and liabilities
      </h4>
      {!props.assetsOnly && (
        <>
          <div className="netWorthText">{`Your total across ${
            props.numOfItems
          } bank ${pluralize('account', props.numOfItems)}`}</div>
          <h2 className="netWorthDollars">
            Networth: {currencyFilter(assets - liabilities)}
          </h2>
          <h2>Assets: {currencyFilter(assets)}</h2>
          <h2>Liabilities: {currencyFilter(liabilities)}</h2>
          <div className="holdingsContainer">
            <div className="userDataBox">
              <DataTable
                title="Assets"
                columns={columns}
                data={assetData}
                onAdd={handleAddAsset}
                onDelete={handleDeleteAsset}
                showAddForm={showAddForm}
                handleSubmit={handleSubmit}
                description={description}
                setDescription={setDescription}
                value={value}
                setValue={setValue}
                onClose={handleCloseForm}  // Pass the close handler
              />
            </div>
            <div className="userDataBox">
              <DataTable
                title="Liabilities"
                columns={columns}
                data={liabilityData}
                // No delete functionality for liabilities
              />
            </div>
          </div>
        </>
      )}
      {props.assetsOnly && (
        <>
          <h2 className="netWorthDollars">
            {currencyFilter(assets - liabilities)}
          </h2>
          <div className="holdingsContainer">
            <div className="userDataBox">
              <DataTable
                title="Assets"
                columns={columns}
                data={assetData}
                onAdd={handleAddAsset}
                onDelete={handleDeleteAsset}
                showAddForm={showAddForm}
                handleSubmit={handleSubmit}
                description={description}
                setDescription={setDescription}
                value={value}
                setValue={setValue}
                onClose={handleCloseForm}  // Pass the close handler
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NetWorth;

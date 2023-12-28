import React, { useState, useEffect, useMemo } from 'react';
import { faker } from '@faker-js/faker';
import AutoSizer from 'react-virtualized-auto-sizer';
import { DataGrid } from '@mui/x-data-grid';

const generateFakeData = (count) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    const row = {
      id: i + 1,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      username: faker.internet.userName(),
      city: faker.location.city(),
      status: faker.datatype.boolean() ? 'Active' : 'Inactive',
    };
    data.push(row);
  }
  return data;
};

const columns = [
  { field: 'name', headerName: 'Name', flex: 1, sortable: true, filterable: true },
  { field: 'email', headerName: 'Email', flex: 1, sortable: true, filterable: true },
  { field: 'username', headerName: 'UserName', flex: 1, sortable: true, filterable: true },
  { field: 'city', headerName: 'City', flex: 1, sortable: true, filterable: true },
  { field: 'status', headerName: 'Status', flex: 1, sortable: true, filterable: true },
];

const Users = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10000);
  const [totalRows, setTotalRows] = useState(0);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDataAndSetState = useMemo(() => {
    return () => {
      const data = generateFakeData(pageSize);
      setRows(data);
      setTotalRows(pageSize * 10);
    };
  }, [pageSize]);

  useEffect(() => {
    fetchDataAndSetState();
  }, [page, pageSize, fetchDataAndSetState]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const handleScroll = (params) => {
    const { scrollTop, clientHeight, scrollHeight } = params;

    // Check if scrolling to the bottom
    const isScrollingToBottom = scrollTop + clientHeight >= scrollHeight - 100;

    if (isScrollingToBottom && !loading) {
      setLoading(true);
      // Simulate fetching more data with a delay
      setTimeout(() => {
        const newData = generateFakeData(pageSize);
        setRows((prevRows) => [...prevRows, ...newData]);
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div style={{ height: 500, width: '100%' }}>
      <AutoSizer>
        {({ height, width }) => (
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={pageSize}
            rowsPerPageOptions={[50, 100, 200]}
            checkboxSelection
            disableSelectionOnClick
            pagination
            onPageChange={(newPage) => handlePageChange(newPage)}
            onPageSizeChange={(newPageSize) => handlePageSizeChange(newPageSize)}
            rowCount={totalRows}
            style={{ height, width }}
            onScroll={handleScroll}
          />
        )}
      </AutoSizer>
    </div>
  );
};

export default Users;

import React, { useEffect, useState } from 'react';
import { OrganismType } from './Region';
import { DataGridPro, GridCallbackDetails, GridColDef, GridRowParams, MuiEvent } from '@mui/x-data-grid-pro';

type GapData = {
  gene: string;
  geneStart: number;
  geneEnd: number;
  gapStart: number;
  gapEnd: number;
  gapSize: number;
};

const GapTable: React.FC<{ sequenceid: string; organism: OrganismType; setFeature: (f: string) => void }> = ({
  sequenceid,
  organism,
  setFeature,
}) => {
  const [gapList, setGapList] = useState([]);

  const columns: GridColDef[] = [
    {
      field: 'gene',
      headerName: 'Gene / feature',
      flex: 0.25,
    },

    {
      field: 'geneStart',
      headerName: 'Gene / feature start',
      flex: 0.15,
    },
    {
      field: 'geneEnd',
      headerName: 'Gene / feature end',
      flex: 0.15,
    },

    {
      field: 'gapStart',
      headerName: 'Gap start',
      flex: 0.15,
    },
    {
      field: 'gapEnd',
      headerName: 'Gap end',
      flex: 0.15,
    },
    {
      field: 'gapSize',
      headerName: 'Gap size',
      flex: 0.15,
    },
  ];

  // get the sequence list
  useEffect(() => {
    if (sequenceid === undefined || organism === undefined) {
      setGapList([]);
      return;
    }

    const filename = `${sequenceid}-${organism}.gap-report.json`;

    fetch(`http://127.0.0.1:8080/gaps/${filename}`)
      .then(response => response.json())
      .then(json => {
        setGapList(json.map((r: any, i: number) => ({ ...r, id: i })));
      });
  }, [sequenceid, organism]);

  const onRowClick = (params: GridRowParams, event: MuiEvent, details: GridCallbackDetails) => {
    setFeature((params.row as GapData).gene);
  };

  return (
    <div style={{ height: '50vh', width: '100%' }}>
      <DataGridPro
        loading={false}
        rows={gapList}
        columns={columns}
        pagination={true}
        disableRowSelectionOnClick={true}
        onRowClick={onRowClick}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
      />
    </div>
  );
};

export default GapTable;

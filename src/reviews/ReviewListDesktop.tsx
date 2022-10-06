import * as React from 'react';
import {
    BulkDeleteButton,
    Datagrid,
    DateField,
    Identifier,
    TextField,
    useGetList,
    useListContext,
} from 'react-admin';
import { Divider, Tab, Tabs } from '@mui/material';

import ProductReferenceField from '../products/ProductReferenceField';
import CustomerReferenceField from '../visitors/CustomerReferenceField';

import rowStyle from './rowStyle';
import StarRatingField from './StarRatingField';

import BulkAcceptButton from './BulkAcceptButton';
import BulkRejectButton from './BulkRejectButton';

export interface ReviewListDesktopProps {
    selectedRow?: Identifier;
    listType?: 'origin' | 'status' | 'rating';
}

const tabs = [
    { id: 'pending', name: 'pending' },
    { id: 'accepted', name: 'accepted' },
    { id: 'rejected', name: 'rejected' },
];

const useGetStatusTotals = (filterValues: any) => {
    const { total: totalPending } = useGetList('reviews', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'id', order: 'ASC' },
        filter: { ...filterValues, status: 'pending' },
    });
    const { total: totalAccepted } = useGetList('reviews', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'id', order: 'ASC' },
        filter: { ...filterValues, status: 'accepted' },
    });
    const { total: totalRejected } = useGetList('reviews', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'id', order: 'ASC' },
        filter: { ...filterValues, status: 'rejected' },
    });

    return {
        pending: totalPending,
        accepted: totalAccepted,
        rejected: totalRejected,
    };
};

const useGetRatingTotal = (filterValues: any) => {
    const { total: total1 } = useGetList('reviews', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'id', order: 'ASC' },
        filter: { ...filterValues, rating: 1 },
    });
    const { total: total2 } = useGetList('reviews', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'id', order: 'ASC' },
        filter: { ...filterValues, rating: 2 },
    });
    const { total: total3 } = useGetList('reviews', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'id', order: 'ASC' },
        filter: { ...filterValues, rating: 3 },
    });
    const { total: total4 } = useGetList('reviews', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'id', order: 'ASC' },
        filter: { ...filterValues, rating: 4 },
    });
    const { total: total5 } = useGetList('reviews', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'id', order: 'ASC' },
        filter: { ...filterValues, rating: 5 },
    });

    return [total1, total2, total3, total4, total5];
};

const ReviewsBulkActionButtons = () => (
    <>
        <BulkAcceptButton />
        <BulkRejectButton />
        <BulkDeleteButton />
    </>
);

const ReviewListDesktop = ({
    selectedRow,
    listType = 'origin',
}: ReviewListDesktopProps) => {
    const listContext = useListContext();
    const { filterValues, setFilters, displayedFilters } = listContext;
    const statusTotals = useGetStatusTotals(filterValues) as any;
    const ratingTotals = useGetRatingTotal(filterValues) as any;

    const handleChange = React.useCallback(
        (event: React.ChangeEvent<{}>, value: any) => {
            if (listType === 'origin') return;

            if (setFilters) {
                if (listType === 'status') {
                    setFilters(
                        { ...filterValues, status: value },
                        displayedFilters,
                        false // no debounce, we want the filter to fire immediately
                    );
                } else {
                    setFilters(
                        { ...filterValues, rating: value },
                        displayedFilters,
                        false // no debounce, we want the filter to fire immediately
                    );
                }
            }
        },
        [displayedFilters, filterValues, setFilters, listType]
    );

    if (listType === 'origin') {
        return (
            <Datagrid
                rowClick="edit"
                rowStyle={rowStyle(selectedRow)}
                optimized
                bulkActionButtons={<ReviewsBulkActionButtons />}
                sx={{
                    '& .RaDatagrid-thead': {
                        borderLeftColor: 'transparent',
                        borderLeftWidth: 5,
                        borderLeftStyle: 'solid',
                    },
                    '& .column-comment': {
                        maxWidth: '18em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    },
                }}
            >
                <DateField source="date" />
                <CustomerReferenceField link={false} />
                <ProductReferenceField link={false} />
                <StarRatingField size="small" />
                <TextField source="comment" />
                <TextField source="status" />
            </Datagrid>
        );
    }

    return (
        <React.Fragment>
            <Tabs
                variant="fullWidth"
                centered
                value={filterValues[listType]}
                indicatorColor="primary"
                onChange={handleChange}
            >
                {listType === 'status' &&
                    tabs.map(choice => (
                        <Tab
                            key={choice.id}
                            label={
                                statusTotals[choice.name]
                                    ? `${choice.name} (${
                                          statusTotals[choice.name]
                                      })`
                                    : choice.name
                            }
                            value={choice.id}
                        />
                    ))}
                {listType === 'rating' &&
                    [1, 2, 3, 4, 5].map(choice => (
                        <Tab
                            key={choice}
                            label={
                                ratingTotals[choice - 1]
                                    ? `${choice} STAR (${
                                          ratingTotals[choice - 1]
                                      })`
                                    : `${choice} STAR`
                            }
                            value={choice}
                        />
                    ))}
            </Tabs>
            <Divider />
            <Datagrid
                rowClick="edit"
                rowStyle={rowStyle(selectedRow)}
                optimized
                bulkActionButtons={<ReviewsBulkActionButtons />}
                sx={{
                    '& .RaDatagrid-thead': {
                        borderLeftColor: 'transparent',
                        borderLeftWidth: 5,
                        borderLeftStyle: 'solid',
                    },
                    '& .column-comment': {
                        maxWidth: '18em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    },
                }}
            >
                <DateField source="date" />
                <CustomerReferenceField link={false} />
                <ProductReferenceField link={false} />
                <StarRatingField size="small" />
                <TextField source="comment" />
                <TextField source="status" />
            </Datagrid>
        </React.Fragment>
    );
};

export default ReviewListDesktop;

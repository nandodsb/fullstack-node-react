import { gql, useMutation, useQuery } from '@apollo/client';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { startCase, uniq } from 'lodash';
import { SubmissionsQuery } from '../generated/graphql';
// import { useEffect } from 'react';

export function Dashboard() {
	const { data, error, loading } = useQuery<SubmissionsQuery>(gql`
		query Submissions {
			submissions {
				id
				submittedAt
				data
			}
		}
	`);

	const [generateSubmission /** , { data, error, loading }*/] = useMutation(
		gql`
			mutation GenerateSubmission($count: Int!) {
				queueSubmissionGeneration(count: $count)
			}
		`,
		{ variables: { count: 10 } }
	);

	// useEffect(() => {
	// 	generateSubmission;
	// }, []);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>{error.message}</div>;

	const { submissions } = data!;
	const columns: GridColDef[] = [
		{ field: 'id', headerName: 'ID' },
		{ field: 'submittedAt', headerName: 'submittedAt' },
		//
		...uniq(submissions.flatMap((s) => Object.keys(s.data))).map((field) => ({
			field,
			headerName: startCase(field),
			width: 200,
			valueGetter: (params: GridValueGetterParams) => params.row.data[field]
		}))
	];

	return (
		<>
			<AppBar position="static">
				<Toolbar>
					<IconButton
						size="large"
						edge="start"
						color="inherit"
						aria-label="menu"
						sx={{ mr: 2 }}
					>
						<MenuIcon />
					</IconButton>
					<Typography
						variant="h6"
						component="div"
						sx={{ flexGrow: 1 }}
					>
						News
					</Typography>
					<Button
						onClick={() => generateSubmission()}
						variant="contained"
						color="secondary"
					>
						Generate Submissions
					</Button>
				</Toolbar>
			</AppBar>
			<DataGrid
				rows={submissions}
				columns={columns}
				initialState={{
					pagination: {
						paginationModel: { page: 0, pageSize: 10 }
					}
				}}
				pageSizeOptions={[5, 10]}
				checkboxSelection
			/>
		</>
	);
}

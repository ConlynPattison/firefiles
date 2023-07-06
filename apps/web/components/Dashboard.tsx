import {
	Box,
	Center,
	Divider,
	Text,
	useColorMode,
	Button,
	Grid,
} from "@chakra-ui/react";
import UploadFileButton from "@components/files/UploadFileButton";
import FolderBreadCrumbs from "@components/folders/FolderBreadCrumbs";
import Navbar from "@components/ui/Navbar";
import useBucket from "@hooks/useBucket";
import useKeys from "@hooks/useKeys";
import { Provider } from "@util/types";
import React, { useEffect, useMemo, useState } from "react";
import Dropzone from "react-dropzone";
import LoadingOverlay from "react-loading-overlay";
import UploadProgress from "./files/UploadProgress";
import GridView from "./GridView";
import ListView from "./ListView";
import { DriveFile } from "@util/types";
import { sortDriveFiles } from "@util/helpers/file-sorting";
import { SortFilterConfig } from "@util/types";


const baseStyle = {
	outline: "none",
	transition: "border .2s ease-in-out",
};

const activeStyle = {
	borderWidth: 2,
	borderRadius: 2,
	borderStyle: "dashed",
	borderColor: "#2196f3",
	backgroundColor: "rgba(0, 0, 0, 0.25)",
};

const Dashboard = () => {
	const [draggedFilesToUpload, setDraggedFilesToUpload] = useState<File[]>([]);
	const [isDragging, setIsDragging] = useState(false);
	const [isFolderDeleting, setIsFolderDeleting] = useState(false);
	const { currentFolder, files, folders, loading, uploadingFiles } = useBucket();
	const { colorMode } = useColorMode();
	const style = useMemo(() => ({ ...baseStyle, ...(isDragging ? activeStyle : {}) }), [isDragging]);
	const [gridView, setGridView] = useState(false);
	// const [fileSort, setFileSort] = useState("name");
	// const [isAscending, setIsAscending] = useState(true);
	const [fileFilters, setFileFilters] = useState<SortFilterConfig>({property: "name", isAscending: true});

	useEffect(() => {
		const storedView = localStorage.getItem("grid_view");
		const storedFilterConfig = JSON.parse(localStorage.getItem("file_filter_config"));

		if (storedView) setGridView(storedView === "true");
		if (storedFilterConfig) setFileFilters(storedFilterConfig);
	}, []);

	useEffect(() => {
		localStorage.setItem("grid_view", gridView.toString());
	}, [gridView]);

	useEffect(() => {
		localStorage.setItem("file_filter_config", fileFilters.toString());
	}, [fileFilters]);


	return (
		<>
			<LoadingOverlay
				active={isFolderDeleting}
				spinner={true}
				text={`Deleting Files... \nPlease DO NOT close this tab.`}
			>
				<Dropzone
					onDrop={(files) => {
						setDraggedFilesToUpload(files);
						setIsDragging(false);
					}}
					noClick
					onDragOver={() => setIsDragging(true)}
					onDragLeave={() => setIsDragging(false)}
				>
					{({ getRootProps, getInputProps }) => (
						<Box
							{...getRootProps({
								style,
							})}
							minH="93vh"
						>
							<input {...getInputProps()} />
							<Text
								hidden={!isDragging}
								fontSize={["2xl", "3xl", "3xl"]}
								opacity="0.9"
								color={colorMode === "light" ? "gray.700" : "gray.300"}
								fontWeight="700"
								align="center"
								pos="absolute"
								top="50%"
								left="50%"
								w="full"
								transform="translate(-50%, -50%)"
								p="0"
								px="2"
								m="0"
							>
								DROP FILES ANYWHERE ON THE SCREEN
							</Text>
							<Navbar />
							<FolderBreadCrumbs currentFolder={currentFolder} />
							<Divider />
							{/* Temporary buttons/elements used for logic dev */}
							<Grid
								templateColumns={[
									"repeat(auto-fill, minmax(140px, 1fr))",
									"repeat(auto-fill, minmax(160px, 1fr))",
									"repeat(auto-fill, minmax(160px, 1fr))",
								]}
								gap={[2, 6, 6]}
							>
								<Button onClick={() => setFileFilters({...fileFilters, ['property']: 'name'})}>Name</Button>
								<Button onClick={() => setFileFilters({...fileFilters, ['property']: 'size'})}>Size</Button>
								<Button onClick={() => setFileFilters({...fileFilters, ['property']: 'createdAt'})}>Created At</Button>
								<Button onClick={() => setFileFilters({...fileFilters, ['isAscending']: !fileFilters.isAscending})}>
									{fileFilters.isAscending ? "DESC" : "ASC"}
								</Button>
							</Grid>
							{/* This is likely where the sort will be done? */}
							{files?.length > 0 && sortDriveFiles(files, fileFilters)}
							{!gridView ? (
								<ListView
									loading={loading}
									currentFolder={currentFolder}
									files={files}
									folders={folders}
									setGridView={setGridView}
									setIsFolderDeleting={setIsFolderDeleting}
								/>
							) : (
								<GridView
									loading={loading}
									currentFolder={currentFolder}
									files={files}
									folders={folders}
									setGridView={setGridView}
									setIsFolderDeleting={setIsFolderDeleting}
								/>
							)}
						</Box>
					)}
				</Dropzone>
				<UploadFileButton
					filesToUpload={draggedFilesToUpload}
					setFilesToUpload={setDraggedFilesToUpload}
				/>
			</LoadingOverlay>
			{uploadingFiles.length > 0 && (
				<Center>
					<Box
						borderRadius="sm"
						px="4"
						pos="fixed"
						bottom="5%"
						width={["90vw", "60vw", "60vw"]}
						boxShadow="3.8px 4.1px 6.3px -1.7px rgba(0, 0, 0, 0.2)"
						backgroundColor={colorMode === "dark" ? "gray.700" : "white"}
					>
						{uploadingFiles.map((uploading) => (
							<UploadProgress key={uploading.id} file={uploading} />
						))}
					</Box>
				</Center>
			)}
		</>
	);
};

export default Dashboard;

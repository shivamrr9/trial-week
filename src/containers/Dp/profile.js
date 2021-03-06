import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	Test,
	ApiCall,
	postApiCall,
	responseGoogle,
	showUploadedImages,
	onCheckForDelete,
	deleteSelectedImages,
	undoAction,
	optimizeLoader,
	fileCount,
	recordTags,
	addTagsToPhotos,
	selectedTab,
	uploadPhotos,
	openEmailModal,
	getEmailToBeSearched,
	changeView,
	getImagesOnEmail
} from './actions.js';
import styles from './styles.scss';
import CircularProgress from '@material-ui/core/CircularProgress';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Header from './header';
import Dropzone from 'react-dropzone';
import Button from '@material-ui/core/Button';
import Gallery from 'react-grid-gallery';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { stat } from 'fs';
import Icon from '@material-ui/core/Icon';
import {compressImage} from '../../components/imageUtilities';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'; 
import Modal from 'react-bootstrap/Modal';
import Switch from '@material-ui/core/Switch';
import * as introJs from 'intro.js';

const introJsObj = introJs.introJs();

class Profile extends Component {

	onSelectImage(index,image,allImages){
		console.log("index of selected image: ",index);
		console.log("selected image: ",image);
		console.log(allImages[index]);
	}

	changeView(viewOption){
			this.props.changeView(viewOption);
	}

	searchByModalEmail(emailToBeSearchedByModal){
		this.props.openEmailModal(false);
		this.props.history.push('/profile/'+emailToBeSearchedByModal);
	}

	uploadPhotos(imagesToBeUploaded){
			let len = imagesToBeUploaded.length;
			let count = 0;
			let upload3Array = [];
			let uploadLeftOverArray = [];
			let reminder = len%3;
			let quotient = Math.floor(len/3);
			console.log("quotient:",quotient);
			console.log("reminder:",reminder);
			
			imagesToBeUploaded.map((imagObj)=>{
					count++;
					upload3Array.push(imagObj);
					if(count===3){
						this.props.uploadPhotos(upload3Array);
						count = 0;
						upload3Array = [];
					}
			})

			if(reminder>0){
				console.log("reminder chala:");
				uploadLeftOverArray = imagesToBeUploaded.slice(quotient*3,len);
				console.log(quotient*3,len)
				console.log("left over array: ",uploadLeftOverArray);
				this.props.uploadPhotos(uploadLeftOverArray);
			}
		
	}

	closeToast(string,holdTime){
    toast(string, { autoClose: holdTime });
	} 

	goToLogin(){
		this.props.history.push('/');
	}

	componentDidMount(){
		let x = new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$");
		if(x.test(this.props.match.params.email)){
		if(localStorage.getItem('google-auth-token')){
			let user_data = JSON.parse(localStorage.getItem('user_details'));
			if(user_data.email === this.props.match.params.email){
			 this.closeToast("Welcome " + user_data.email,2500);
			}
		}
		else{
			this.closeToast("Login To Upload Photos!! Viewing is allowed without login ", 4000);
		}
		this.props.getImagesOnEmail(this.props.match.params.email);
	}
	else{
			this.props.openEmailModal(true);
	}
}

	handleClose(){
		//write code to close toast logic sochna hai..
	}

	handleUndo(currentImages,deletedImages){
		this.props.undoAction(currentImages,deletedImages);
	}

	deleteSelectedImages(imagesOnLocal){
		this.props.deleteSelectedImages(imagesOnLocal);
	}

	onCheckForDelete(val,imageObj,imagesOnLocal){
		this.props.onCheckForDelete(val,imageObj,imagesOnLocal);
	}

	onDrop(acceptedFiles,rejectedFiles){
							this.props.optimizeLoader(true,"Optimizing");
							this.props.fileCount(1,acceptedFiles.length);
        if (rejectedFiles && rejectedFiles.length) {
            alert('File is not allowed');
        } else {
            let size = 20 * 1024 * 1024;
            let sendFiles = [], groupUploadFiles = [];
						let fileCount = 0;
						console.log("original files:",acceptedFiles);
            acceptedFiles.forEach((file) => {
                compressImage(file, { quality: 2, jpegQuality: .4 }).then((processedImage) => {
                    let fileUpdated = new File([processedImage], `${Date.now()}_zomato_trial_insta.jpg`, {
                        type: 'image/jpeg',
												lastModified: Date.now(),
										}
										);
										fileUpdated.preview = file.preview;
										this.props.fileCount(fileCount,acceptedFiles.length);
                    if (fileUpdated.size > size) {
                        alert(`files have size greater than 20mb , Kindly upload a smaller files`);
                    } else {
                        if (fileUpdated.size > size) {
                            groupUploadFiles.push(sendFiles);
                            size = 20 * 1024 * 1024;
                            sendFiles = [];
                        }
                        if (fileUpdated.size <= size) {
                            sendFiles.push(fileUpdated);
                            size = size - fileUpdated.size;
                        }
												 fileCount++;
												 console.log("file count:",fileCount);
                    }
                    if (acceptedFiles.length && fileCount === acceptedFiles.length) {
                        this.props.optimizeLoader(false);
												groupUploadFiles.push(sendFiles);
                        groupUploadFiles.map((uploadFiles) => {
													console.log("compressed version: ",uploadFiles);
												this.props.showUploadedImages(uploadFiles);
                        });
                    }
                });
						});
        }
	}

  render() {

		if(this.props.uploadApiResponse){
			this.closeToast("Photos Uploaded! Check Photos for Updates!", 2500);
		}
		let x = new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$");
		if(x.test(this.props.match.params.email)){
	}
	else{
			this.props.openEmailModal(true);
	}

		console.log("profile props: ",this.props);
	 return (
		<div>
			<Header 
					props={this.props} 
			/>
			<Paper square>
			<Tabs
					style={{color:'red'}}
          indicatorColor="primary"
          textColor="primary"
					onChange={(event,value)=>{this.props.selectedTab(value)}}
					value={this.props.selectedTabValue}
					centered={true}
        >
					<Tab 
						label="Photos" 
					/>
					{localStorage.getItem('google-auth-token') && 
					(JSON.parse(localStorage.getItem('user_details')).email === this.props.match.params.email) &&
					<Tab 
						label="Upload Photos" 
						disabled={false}
						/>
					}
      </Tabs>
			</Paper>
			{this.props.selectedTabValue ?
			<div className="upload-photo-view">
			<Container>
    <Row className="col-center">
      <Col md={2}>
			{this.props.imagesOnLocal &&
			<div style={{marginTop: '70px',textAlign:'center'}}>
					<Button 
						variant="contained"
						color="primary"
						className="delete-button"
						onClick={()=>{this.deleteSelectedImages(this.props.imagesOnLocal)}}
					>
					Delete Photos
				</Button>
				</div>
			}
			</Col>
      <Col md={8}>
			{this.props.imagesOnLocal && this.props.imagesOnLocal.length > 0 ?
		<div style={{marginTop:'50px'}}>
			<Row>
				<Col md={6}>	
					<span>Assign a Tag to your Album/Photos:</span>
				</Col>
				<Col md={4}>
				<Tooltip title="To enter multiple tags use comma (,)" placement="bottom">
				<input 
						type="text" 
						placeholder="Enter Tags"
						onChange={(val)=>{this.props.recordTags(val.target.value)}}
					/>
        </Tooltip>
					
				</Col>
				<Col md={2}>
				
				<div>
					{this.props.isTagAdded ?
					<Button variant="contained" color="secondary">
							Added
					</Button> :
					<Button 
						variant="contained" 
						color="primary" 
						onClick={()=>{this.props.addTagsToPhotos(this.props.tagsData,this.props.imagesOnLocal)}}
						disabled={this.props.tagsData ? false : true}
						>
					 	Add
					</Button>
					}
					</div>
				
				</Col>
			</Row>
			<div style={{border:'1px solid #E0E0E0',boxShadow: '2px 2px 2px 2px #E0E0E0',marginTop:'50px'}}>
				<Row>
					{this.props.imagesOnLocal.map(obj=>{
							return <Col md={4}><img style={{padding:'10px'}} height="200px" width="220px" src={obj.preview} alt="images" />
							{obj.tags &&
								<span>{obj.tags.toString()}</span>
							}
							<Checkbox
								checked={obj.isCheckedForDelete}
								onChange={(val)=>{this.onCheckForDelete(val.target.checked,obj,this.props.imagesOnLocal)}}
								color="primary"
							/>
						</Col>
					})
					}
				</Row>
			</div>
			</div> :
			<div className="upload-container">
			<div data-intro="Upload Photu">
			<Dropzone
            className="dropZone"
            accept={"image/png,image/jpeg,image/jpg,image/svg"}
            multiple={true}
            onDrop={(acceptedFiles, rejectedFiles) => this.onDrop(acceptedFiles, rejectedFiles)}
            >
						<Button 
							style={{marginTop: '100px',marginBottom:'50px'}}
							variant="contained"
							color="primary"
							className="upload-button"
						>
							Upload Photos
						</Button>
      </Dropzone>
			</div>
			<span>No Uploads So Far.. Upload Photos?</span>
			</div>
			}
			</Col>
			<Col md={2}>
			{this.props.imagesOnLocal &&
			<div style={{marginTop: '70px'}}>
					<Button 
					variant="contained"
					color="primary"
					className="final-upload-button"
					onClick={()=>{this.uploadPhotos(this.props.imagesOnLocal)}}
				>
					Start Upload
				</Button>
				</div>
			}
			</Col>
			</Row>
		</Container>
		</div> : 
		<div className="photos-view">
			<Container>
					<Row>
							<Col md={2}></Col>
							<Col md={8}>
							{this.props.toggelView ? 
							<div className="images-list-box-container">
							<Row>
								<Col md={12}>
								{this.props.getImagesPayload && this.props.getImagesPayload.length > 0 &&
									this.props.getImagesPayload.map((listViewObj)=>{
										return (<div style={{width:'100%',height:'140px',boxShadow: '2px 2px 2px 2px #E0E0E0', border:'1px solid #E0E0E0'}}>
											<img style={{width:'50%',height:'160px'}} src={listViewObj.thumbnail} alt="list-view-photos"/>
											<span><b>Associated Tags: </b>{listViewObj && listViewObj.caption ? listViewObj.caption : 'No Tags Present'}</span>
											<span>
											<Checkbox
												style={{float:'right'}}
												checked={true}
												onChange={(val)=>{console.log(val.target.checked)}}
												color="primary"
											/>
											</span>
										</div>)
									})
								}
								</Col>
							</Row>
							</div> :
								<div style={{textAlign:'center'}} className="images-grid-box-container">
								{this.props.getImagesPayload && this.props.getImagesPayload.length > 0 &&
									<Gallery 
										images={this.props.getImagesPayload}
										onSelectImage={(index,image)=>{this.onSelectImage(index,image,this.props.getImagesPayload)}}
									/>
								}
								</div>
							}
							</Col>
							<Col md={2}>
							<div className="toggle-view">
							<span><br />Grid</span>
							<Switch
								// checked={true}
								onChange={(val)=>{this.changeView(val.target.checked)}}
								color="primary"
							/>
							<span>List</span>
							</div>
							</Col>
					</Row>
			</Container>
		</div>
		}
  	  {this.props.visibility &&
			 <div className="full-loader">
				<div className="relative">
				  <div className="abs" id='full-screen-loader-wrapper'>
					 <CircularProgress size={50} thickness={5} />
					 {/* <span style={{color:'white'}}>` ${this.props.currentCount}  ${this.props.totalCount}`</span> */}
					 <span style={{color:'white'}}>
						{`
						${this.props.loaderString} `}
						{this.props.loaderString==="Optimizing" && 
						this.props.currentCount}/{this.props.totalCount}
					 </span>
				  </div>
				</div>
			 </div>
			}
			<Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.props.imagesToBeDeleted ? true : false}
          autoHideDuration={2000}
          onClose={()=>{this.handleClose()}}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{`Deleted ${this.props.imagesToBeDeleted ? this.props.imagesToBeDeleted.length : ''} Images`}</span>}
          action={[
            <Button key="undo" color="secondary" size="small" onClick={()=>{this.handleUndo(this.props.imagesOnLocal,this.props.imagesToBeDeleted)}}>
              UNDO
            </Button>,
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
							onClick={()=>{this.handleClose()}}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
				<ToastContainer 
      autoClose={2500} 
     />
		 <Modal show={this.props.openModal} onHide={this.handleClose}>
          <Modal.Header>
            <Modal.Title>You Entered a wrong Email!!</Modal.Title>
          </Modal.Header>
          <Modal.Body>Enter correct Email ID : <input type="email" placeholder="Email to be searched" onChange={(val)=>{this.props.getEmailToBeSearched(val.target.value)}} /></Modal.Body>
					<button onClick={()=>{this.searchByModalEmail(this.props.emailToBeSearchedByModal)}}>Submit</button>
          {!localStorage.getItem('google-auth-token') &&
					<Modal.Footer>
           <span style={{textAlign:'left'}}>Not a member yet? <span style={{color:'blue',cursor:'pointer'}} onClick={()=>{this.goToLogin()}}>Click here</span> to Join Minimal Instagram!!</span>
					 </Modal.Footer>
					}
      </Modal>
		</div>
	 );
  }
}

const mapStateToProps = state => ({
	test: state.postReducer.test,
	response: state.postReducer.response,
	Postresponse: state.postReducer.Postresponse,
	visibility: state.postReducer.visibility,
	googleResponse: state.postReducer.googleResponse,
	imagesOnLocal: state.postReducer.imagesOnLocal,
	isAnyCheckBoxChecked: state.postReducer.isAnyCheckBoxChecked,
	imagesToBeDeleted: state.postReducer.imagesToBeDeleted,
	undo: state.postReducer.undo,
	loaderString: state.postReducer.loaderString,
	currentCount: state.postReducer.currentCount,
	totalCount: state.postReducer.totalCount,
	tagsData: state.postReducer.tagsData,
	isTagAdded: state.postReducer.isTagAdded,
	selectedTabValue: state.postReducer.selectedTabValue,
	openModal: state.postReducer.openModal,
	emailToBeSearchedByModal: state.postReducer.emailToBeSearchedByModal,
	toggelView: state.postReducer.toggelView,
	uploadApiResponse: state.postReducer.uploadApiResponse,
	getImagesPayload: state.postReducer.getImagesPayload
})

export default connect(mapStateToProps, {
	Test,
	ApiCall,
	postApiCall,
	responseGoogle,
	showUploadedImages,
	onCheckForDelete,
	deleteSelectedImages,
	undoAction,
	optimizeLoader,
	fileCount,
	recordTags,
	addTagsToPhotos,
	selectedTab,
	uploadPhotos,
	openEmailModal,
	getEmailToBeSearched,
	changeView,
	getImagesOnEmail
})(Profile);


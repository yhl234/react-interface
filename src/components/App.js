import React from 'react';
import '../css/App.css';
import AddAppointments from './AddAppointments';
import SearchAppointments from './SearchAppointments';
import ListAppointments from './ListAppointments';
import { findIndex, without } from 'lodash'
class App extends React.Component {
	constructor(){
		super();
		this.state ={
			id:0,
			appointments:[],
			formDisplay: false,
			orderBy:'petName',
			orderDir:'asc',
			queryText:''
		}
		this.deleteAppoints = this.deleteAppoints.bind(this)
		this.toggleForm = this.toggleForm.bind(this)
		this.addAppointments = this.addAppointments.bind(this)
		this.changeOrder = this.changeOrder.bind(this)
		this.searchApts = this.searchApts.bind(this)
		this.updateInfo = this.updateInfo.bind(this)


	}
	toggleForm(){
		this.setState({
			formDisplay: !this.state.formDisplay
		})
	}
	addAppointments(temApt){
		let temApts = this.state.appointments;
		temApt.id = this.state.id;
		temApts.unshift(temApt);
		this.setState({
			appointments:temApts,
			id: this.state.id + 1
		})

	}
	searchApts(query){
		this.setState({
			queryText:query
		})
	}
	changeOrder(order, dir){
		this.setState({
			orderBy:order,
			orderDir:dir
		})
	}
	deleteAppoints(apt){
		let temApts = this.state.appointments;
		temApts = without(temApts,apt);
		this.setState({
			appointments:temApts
		})
	}
	updateInfo(name, value, id){
		let temApt = this.state.appointments;
		let index = findIndex(this.state.appointments,{
			id:id
		})
		temApt[index][name] = value;
		this.setState({
			appointments:temApt
		})
	}
	componentDidMount(){
		fetch('./data.json')
			.then(response=>response.json())
			.then(results=>{
				const apt = results.map(result=>{
					result.id = this.state.id
					this.setState({
						id: this.state.id +1
					})
					return result})
				this.setState({
					appointments: apt
				})
			})
	}

	render(){
		let order;
		let filteredAppointments = this.state.appointments;
		this.state.orderDir === 'asc' ? order = 1 : order = -1;
		filteredAppointments = filteredAppointments.sort((a,b)=>{
			if(a[this.state.orderBy].toLowerCase()>b[this.state.orderBy].toLowerCase()) {
				return 1 * order
			} else{
				return -1 * order
			}
		}).filter(item=>{
			return(
				item['petName'].toLowerCase().includes(this.state.queryText.toLocaleLowerCase()) || item['ownerName'].toLowerCase().includes(this.state.queryText.toLocaleLowerCase()) || item['aptNotes'].toLowerCase().includes(this.state.queryText.toLocaleLowerCase()) 
			)	
		})

		return (
			<main className="page bg-white" id="petratings">
			<div className="container">
			  <div className="row">
				<div className="col-md-12 bg-white">
					<div className="container">
					<AddAppointments 
						formDisplay = {this.state.formDisplay}
						toggleForm = {this.toggleForm}
						addAppointments ={this.addAppointments}
						/>
					<SearchAppointments
						orderBy = {this.state.orderBy}
						orderDir = {this.state.orderDir}
						changeOrder = {this.changeOrder}
						searchApts = {this.searchApts}
					/>
					<ListAppointments 
						appointments={filteredAppointments} deleteAppoints={this.deleteAppoints} 
						updateInfo={this.updateInfo}
						/>
				  </div>
				</div>
			  </div>
			</div>
		  </main>
		  );
	}
  
}

export default App;

<H1>Good Food (POS) System Readme</H1>

<H2>Introduction</H2>
Welcome to good food Point of Sale (POS) System! This software is designed to my learnimg purpose, providing a user-friendly interface and robust features for managing sales, inventory, and customer interactions.

<H2>Features</H2>
User-Friendly Interface: Intuitive design for easy navigation and quick transactions.<br>
responsive : responsive for all devices.<br>
Sales Management: Create, edit, and manage sales transactions efficiently.<br>
Inventory Tracking: Keep track of product stock levels.<br>
Customer Management: Build and maintain a customer database for personalized service.<br>
Reporting: Access detailed sales reports, inventory summaries, and customer purchase history.

<H2>Installation</H2>
Follow these steps to install the POS system on your system:<br>
Download: Download the POS System zyp file or clone this project.<br>
Installation : unzip file and open.<br>
Configuration: run backend using apache tomcat 10.1.16 and run frontend using web browser.<br>
Database Setup: get my database from here.<br>
Finish: firstly run backend and now you can use pos system.<br>
For detailed installation instructions, refer to the Installation Guide.

<H2>Getting Started</H2>
Once the POS system is installed, follow these steps to get started:<br>
Login: no special login.<br>
Add Customer: add customer before place order.<br>
Add Products: add item before place order.<br>
place order: now you can place order.

<H3>note: You can modified logging mechanism and error handling as per your wish.</H3>

<H2>database:</H2>
create database itspos;<br>
use itspos;<br><br>
create table customer(<br>
	customerId varchar(255),<br>
	customerName varchar(255),<br>
	nic varchar(13),<br>
	contact int(10),<br>
	constraint PK_Cus primary key (customerId)<br>
);<br>

CREATE TABLE item (<br>
    itemId VARCHAR(255),<br>
    itemName VARCHAR(255),<br>
    price DOUBLE,<br>
    qty DOUBLE,<br>
    CONSTRAINT PK_Item PRIMARY KEY (itemId)<br>
);<br>

CREATE TABLE orderDetail (<br>
    date DATETIME,<br>
    customerId VARCHAR(255),<br>
    orderId VARCHAR(255),<br>
    items TEXT,<br>
    total DOUBLE,<br>
    CONSTRAINT PK_Order PRIMARY KEY (orderId),<br>
    CONSTRAINT FK_Customer FOREIGN KEY (customerId) REFERENCES customer(customerId)<br>
);

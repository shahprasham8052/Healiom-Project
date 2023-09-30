import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import product_image from "./images/arr_img1.jpg";
import Autosuggest from "react-autosuggest";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
    background: "#FAFAFA", // Light background color
    backdropFilter: "blur(25px)", // Apply backdrop filter for a blurred background
  },
  navigation: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(2),
    backgroundColor: "#24dac6", // Attractive teal color
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  },
  brandName: {
    fontFamily: "Arial, sans-serif", // Adjust the font as needed
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff", // White text color
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)", // Text shadow for emphasis
  },
  searchBarContainer: {
    display: "flex",
    position:'relative',
    alignItems: "center",
    width: "40%", // Adjust the width as needed
  },
  search: {
    flex: 1, // Allow the input to grow and take available space
    borderRadius: "10px 10px 10px 10px", // Rounded left corners for search bar
    backgroundColor: "white",
    width: "550px",
    height: "30px",
  },
  searchButton: {
    backgroundColor: "#ff9900", // Orange search button color
    color: "#fff", // White text color
    border: "none",
    borderRadius: "0 10px 10px 0", // Rounded right corners for search button
    padding: "8px 16px",
    cursor: "pointer",
    height: "55px", // Set the height to match the search bar
    width: "80px",
    "&:hover": {
      backgroundColor: "#ff6600", // Darker orange on hover
    },
  },
  filter: {
    display: "flex",
    alignItems: "center",
  },
  filterLabel: {
    color: "#fff", // White text color for filter labels
    marginRight: theme.spacing(1),
    width: "100%",
    fontWeight: "700",
  },
  filterSelect: {
    backgroundColor: "#fff", // White background for filter select
    color: "#333", // Dark text color for filter options
    border: "1px solid #ccc", // Light gray border
    borderRadius: "4px",
    padding: "4px",
    width: "100%", // Make the filter dropdown full width
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.2s",
    "&:hover": {
      transform: "scale(1.03)",
    },
    backgroundColor: "#fff", // White background color
  },
  cardContent: {
    textAlign: "left", // Align text to the left
    padding: theme.spacing(2),
    maxHeight: "100px", // Set a maximum height for the card content
    overflowY: "auto", // Add a vertical scrollbar when content overflows
    textOverflow: "ellipsis",
    WebkitBoxOrient: "vertical",
  },
  image: {
    width: "100%",
    height: "auto",
    marginBottom: theme.spacing(1),
  },
  // Updated styles for beautification
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: theme.spacing(1),
  },
  footer: {
    backgroundColor: "#24dac6", // Attractive teal color
    padding: theme.spacing(2),
    textAlign: "center",
    // position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderTop: "1px solid #fff", // Add a border at the top of the footer
  },
  developerInfo: {
    color: "#fff", // White text color
    fontSize: 16,
    fontWeight: "bold",
  },
  suggestionsContainer: {
    backgroundColor: "#FFFFFF", // Set the background color to white
    position: "absolute",
    zIndex: 999,
    marginTop: theme.spacing(2),
    maxHeight: "200px",
    overflowY: "auto",
    overflowX: "hidden", // Hide horizontal scrollbar
    textAlign: "left", // Align content to the left
  },
}));

function Home1() {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/data", { method: "GET" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((responseData) => {
        setData(responseData);
        setFilteredData(responseData);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedFilter === "All") {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) => item.Brand === selectedFilter);
      setFilteredData(filtered);
    }
  }, [selectedFilter, data]);

  const handleSearchChange = (event) => {
    const newSearchTerm = event ? event.target.value : searchTerm;
    setSearchTerm(newSearchTerm);

    if (data && newSearchTerm) {
      const filtered = data.filter((item) => {
        return (
          item &&
          Object.values(item).some(
            (value) =>
              value &&
              String(value).toLowerCase().includes(newSearchTerm.toLowerCase())
          )
        );
      });

      setFilteredData(filtered);
    } else {
      if (!newSearchTerm) {
        setFilteredData(data);
      } else {
        console.error("'data' is undefined or null");
      }
    }
  };

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  const renderSuggestion = (suggestion) => <div>{suggestion.Name}</div>;

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : filteredData.filter((item) =>
          item.Name?.toLowerCase().includes(inputValue)
        );
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected = (event, { suggestion }) => {
    setSearchTerm(suggestion.Name);
  };

  useEffect(() => {
    searchTerm != (null || undefined) && handleSearchChange();
  }, [searchTerm]);

  const inputProps = {
    placeholder: "Search Product....",
    value: searchTerm,
    onChange: handleSearchChange,
  };

  const filterOptions = ["All", "BC SWAG", "BigCommerce"];

  return (
    <div className={classes.root}>
      <div className={classes.navigation}>
        <div className={classes.brandName}>Healiom</div>
        <div className={classes.searchBarContainer}>
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={(suggestion) => suggestion.Name}
            renderSuggestion={renderSuggestion}
            inputProps={{
              ...inputProps,
              className: classes.search,
            }}
            onSuggestionSelected={onSuggestionSelected}
            containerProps={{
              style: {
                position: "absolute",
                top: '-30px'
              },
              className: classes.suggestionsContainer,
              ":hover": {
                backgroundColor: "#EFEFEF", 
              },
            }}
          />
        </div>
        <div className={classes.filter}>
          <Typography className={classes.filterLabel}>Filter by:</Typography>
          <select
            className={classes.filterSelect}
            value={selectedFilter}
            onChange={handleFilterChange}
          >
            {filterOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Grid container spacing={3}>
        {filteredData.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item["Product ID"]}>
            <Card className={classes.card}>
              <img
                className={classes.image}
                src={product_image}
                alt="Product"
              />
              <CardContent className={classes.cardContent}>
                <Typography
                  variant="h6"
                  component="div"
                  className={classes.cardTitle}
                >
                  {item.Name}
                </Typography>
                <Typography color="textSecondary">
                  <strong>Product ID:</strong> {item["Product ID"]}
                </Typography>
                <Typography color="textSecondary">
                  <strong>Code:</strong> {item.Code}
                </Typography>
                <Typography color="textSecondary">
                  <strong>Brand:</strong> {item.Brand}
                </Typography>
                <Typography color="textSecondary">
                  <strong>Description:</strong> {item.Description}
                </Typography>
                <Typography color="textSecondary">
                  <strong>Cost Price:</strong> {item["Cost Price"]}
                </Typography>
                <Typography color="textSecondary">
                  <strong>Fixed Shipping Price:</strong>{" "}
                  {item["Fixed Shipping Price"]}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <div className={classes.footer}>
        <Typography className={classes.developerInfo}>
          Developed by Prasham Shah | Contact:{" "}
          <a href="mailto:shahprasham8052@gmail.com">
            shahprasham8052@gmail.com
          </a>
        </Typography>
      </div>
    </div>
  );
}

export default Home1;

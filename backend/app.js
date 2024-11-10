// app.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')

const calorieRoutes = require('./routes/calorieRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const stepsRoutes = require('./routes/stepsRoutes');
const carbonRoutes = require('./routes/carbonRoutes');
// const stepsRoutes = require('./routes/stepsRoutes');

const app = express();

// Middleware
app.use(cors()); // Allow CORS
app.use(express.json());

// Routes
// calculate the calories
app.use('/calculate-calories', calorieRoutes);
// get seven day weather forcast
app.use('/weather', weatherRoutes);

// calculate the carbon emissions
app.use('/carbon', carbonRoutes);
// find nearby activities
app.use('/activity-search', stepsRoutes);

app.use('/carbon', carbonRoutes);

// MongoDB connection URI (replace with your own)
const MONGO_URI = "mongodb+srv://xinyangxu2023:Xp12345@cluster1.nz97x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";


// Connect to MongoDB Atlas
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});


// Define the User schema
// Define the Route Schema
const routeSchema = new mongoose.Schema({
    start: {
        type: String,
        required: true
    },
    end: {
        type: String,
        required: true
    },
    mode : {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now // Automatically set the creation date to now
    }
});

// Define the User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address']
    },
    height: {
        type: Number,
        required: false // Optional field
    },
    weight: {
        type: Number,
        required: false // Optional field
    },
    activities: {
        type: [String],
        required: false // Optional array of activities
    },
    ecoPoints: {
        type: Number,
        default: 0 // Start ecoPoints at 0
    },
    savedRoutes: [routeSchema], // Array of Route schema
    completedRoutes: [routeSchema] // Array of Route schema
});

// Remove a specific route by matching all route parameters
app.put('/user/:email/remove-route', async (req, res) => {
    const { email } = req.params;
    const { start, end, mode, type } = req.body;
  
    if (!['saved', 'completed'].includes(type)) {
        return res.status(400).json({ message: 'Invalid route type. Use "saved" or "completed".' });
    }
  
    try {
        // Find the user by email
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
  
        // Remove the route from the appropriate field (savedRoutes or completedRoutes)
        if (type === 'saved') {
            user.savedRoutes = user.savedRoutes.filter(route =>
                route.start !== start ||
                route.end !== end ||
                route.mode !== mode
            );
        } else if (type === 'completed') {
            user.completedRoutes = user.completedRoutes.filter(route =>
                route.start !== start ||
                route.end !== end ||
                route.mode !== mode
            );
        }
  
        // Save the updated user document
        await user.save();
  
        res.status(200).json({ message: `Route removed successfully from ${type} routes`, user });
    } catch (error) {
        console.error('Error removing route:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



// Add a saved or completed trip for an existing user
// Update user with new trip by email
app.put('/user/:email/add-trip', async (req, res) => {
    const { email } = req.params;
    const { start, end, type, mode } = req.body; // Extract trip details from the request body
  
    if (!['saved', 'completed'].includes(type)) {
      return res.status(400).json({ message: 'Invalid trip type. Use "saved" or "completed".' });
    }
  
    try {
      // Find the user by email
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Create a new route object
      const newRoute = {
        start,
        end,
        creationDate: new Date(), // Set current date as the creation date
        mode
      };
  
      // Add the new route to the appropriate field (savedRoutes or completedRoutes)
      if (type === 'saved') {
        user.savedRoutes.push(newRoute);
      } else if (type === 'completed') {
        user.completedRoutes.push(newRoute);
      }
  
      // Save the updated user document
      await user.save();
  
      res.status(200).json({ message: `Trip added successfully to ${type} routes`, user });
    } catch (error) {
      console.error('Error adding trip:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

// Get user profile by name
app.get('/user/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// create a new user
app.post('/register', async (req, res) => {
    try {
        // Create a new user and save to MongoDB
        const newUser = new User(req.body);
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


const User = mongoose.model('User', userSchema);  // Create User model

module.exports = app;
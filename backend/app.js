// app.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')

const calorieRoutes = require('./routes/calorieRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const stepsRoutes = require('./routes/stepsRoutes');
const carbonRoutes = require('./routes/carbonRoutes');
const qrCodeRoutes = require('./routes/qrCodeRoutes');

const app = express();

const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // handle newlines
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });

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

app.use('/checkout', qrCodeRoutes);

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

const activitySchema = {
    phone: {
        type: String,
        required: true
    }, imageLinks:[{
        type: String, 
        required: true
    }], name: {
        type: String, 
        required: true
    }, hours:{
        type: String,
        required: true
    }, rating: {
        type: String,
        required: true
    }, address: {
        type: String,
        required: true
    }
}

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
    activities: [activitySchema],
    ecoPoints: {
        type: Number,
        default: 0 // Start ecoPoints at 0
    },
    interests:{
        type: [String],
        required: true
    },
    savedRoutes: [routeSchema], // Array of Route schema
    completedRoutes: [routeSchema] // Array of Route schema
});


app.put('/user/:email/add-activity', async (req, res) => {
    const { email } = req.params;
    const { phone, imageLinks, name, hours, rating, address } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Create a new activity object
        const activity = {
            phone,
            imageLinks: Array.isArray(imageLinks) ? imageLinks : [imageLinks], // Ensure it's an array
            name,
            hours,
            rating,
            address
        };
        
        // Add the activity to the user's activities list
        user.activities.push(activity);

        // Save the updated user document
        await user.save();

        res.status(200).json({ message: 'Activity added successfully', user });
    } catch (error) {
        console.error('Error adding activity:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove an activity from the user's saved activities by matching name and address
app.put('/user/:email/remove-activity', async (req, res) => {
    const { email } = req.params;
    const { name, address } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Filter out the activity with the given name and address
        user.activities = user.activities.filter(activity => 
            activity.name !== name || activity.address !== address
        );

        // Save the updated user document
        await user.save();

        res.status(200).json({ message: `Activity removed successfully`, user });
    } catch (error) {
        console.error('Error removing activity:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Remove a specific route by matching all route parameters
app.put('/user/:email/remove-trip', async (req, res) => {
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


    // Update the eco score
    app.put('/user/:email/update-score', async (req, res) => {
        const { email } = req.params;
        const { change } = req.body; // Extract change in score from the request body
    
        try {
            // Find the user by email
            const user = await User.findOne({ email: email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            // Update the ecoPoints score
            user.ecoPoints += change;
    
            // Save the updated user document
            await user.save();
    
            res.status(200).json({ message: 'Eco score updated successfully', user });
        } catch (error) {
            console.error('Error updating eco score:', error);
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


//test only
app.get('/users', async (req, res) => {
    try {
        // Retrieve all users from the User model
        const users = await User.find(); // Use await to handle asynchronous operation
        res.status(200).json(users);     // Send the user data as JSON with a 200 OK status
    } catch (error) {
        console.error(error);            // Log the error to the console
        res.status(500).json({ message: 'Server error. Unable to fetch users.' }); // Send a 500 error response
    }
});


app.get('/pointsroutes/:email', async (req, res) => {
    const { email } = req.params; // Access the email from query parameters
    console.log("quering ecopoints for email: ", email)

    try {
        // Find the user by email
        const user = await User.findOne({ email }, 'ecoPoints completedRoutes'); // Only select the 'ecopoints' field
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with the user's ecopoints
        console.log(user);
        res.status(200).json(user);
    } catch (error) {
        console.error(error); // Log any error to the console
        res.status(500).json({ message: 'Server error. Unable to fetch ecopoints.' });
    }
});

app.get('/pointsroutes', async (req, res) => {
    try {
        // Find all users and only select the 'ecoPoints' and 'completedRoutes' fields
        const users = await User.find({}, 'email ecoPoints completedRoutes')
            .sort({ ecoPoints: -1});

        // Send the data in the response
        res.json(users);
    } catch (error) {
        console.error('Error fetching points and routes:', error);
        res.status(500).json({ message: 'Server error' });
    }
});





const User = mongoose.model('User', userSchema);  // Create User model

module.exports = app;

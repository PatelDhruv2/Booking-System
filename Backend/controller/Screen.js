// controllers/screen/createScreenController.js
import prisma from '../config/db.config.js';

const createScreenController = async (req, res) => {
  try {
    const { theatreId, name } = req.body;
    const userId = req.user?.id; // Assumes JWT middleware has set req.user

    // 🔐 Optional: Validate ownership
    const theatre = await prisma.theatre.findUnique({
      where: { id: theatreId },
      include: { owner: true },
    });

    if (!theatre) {
      return res.status(404).json({ message: 'Theatre not found' });
    }

    if (theatre.ownerId !== userId) {
      return res.status(403).json({ message: 'You do not own this theatre' });
    }

    // 🏗️ Create screen
    const screen = await prisma.screen.create({
      data: {
        name,
        theatreId,
      },
    });

    res.status(201).json({
      message: 'Screen created successfully',
      screen,
    });
  } catch (error) {
    console.error('Create Screen Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default createScreenController;

import prisma from '../config/db.config.js';

export const createTheatre = async (req, res) => {
  try {
    const { name, location } = req.body;
    const ownerId = req.user?.id;
    const ownerRole = req.user?.role;

    if (!ownerId) {
      return res.status(401).json({ message: 'Unauthorized: Missing user credentials' });
    }

    if (!['ADMIN', 'THEATRE_OWNER'].includes(ownerRole)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    const theatre = await prisma.theatre.create({
      data: {
        name,
        location,
        ownerId,
      },
    });

    return res.status(201).json({ message: 'Theatre created successfully', theatre });
  } catch (error) {
    console.error('Create Theatre Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTheatres = async (req, res) => {
  const id= req.user?.id;
  const role = req.user?.role;
  try {

    if (!id) {
      return res.status(401).json({ message: 'Unauthorized: Missing user credentials' });
    }
    if( !['ADMIN', 'THEATRE_OWNER'].includes(role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    const theatres = await prisma.theatre.findMany({
      where: {
        ownerId: id,
      },  
      include: {
        owner: true, // Include owner details if needed
      },
    });

    return res.status(200).json({ theatres });
  }catch(e){
    console.error('Get Theatres Error:', e);
    return res.status(500).json({ message: 'Internal server error' });  
  }
}

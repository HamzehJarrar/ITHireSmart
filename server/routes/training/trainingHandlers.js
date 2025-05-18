import Training from "../../models/Training.js"


export async function Posttrain (req, res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const training = new Training({
        user: req.user.id,
        trainingTitle: req.body.trainingTitle,
        companyName: req.body.companyName,
        location: req.body.location,
        startAt: req.body.startAt,
        endAt: req.body.endAt,
        trainingType: req.body.trainingType,
        trainingDescription: req.body.trainingDescription,
        capacity: req.body.capacity,
        topicsCovered: req.body.topicsCovered,
      });

      await training.save();
      res.json(training);
    } catch (error) {
      console.error(error.message);
      res.status(500).send(error.message);
    }
  }


  export async function getalltrain (req, res){
    try {
      const trainings = await Training.find().sort({ createdAt: -1 });
      res.json(trainings);
    } catch (error) {
      console.error(error.message);
      res.status(500).send(error.message);
    }
  }



  export async function gettrainbyid (req, res) {
    try {
      const training = await Training.findById(req.params.trainingId);
      if (!training) {
        return res.status(404).json({ msg: "Training not found" });
      }
      res.json(training);
    } catch (error) {
      console.error(error.message);
      res.status(500).send(error.message);
    }
  }


  export async function deletetrain (req, res){
    try {
      const training = await Training.findById(req.params.trainingId);
      if (!training) {
        return res.status(404).json({ msg: "Training not found" });
      }
      await training.deleteOne();
      res.json({ msg: "Training removed" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send(error.message);
    }
  }


  
export async function updatetrain(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const training = await Training.findById(req.params.trainingId);
    if (!training) {
      return res.status(404).json({ msg: "Training not found" });
    }

    
    training.trainingTitle = req.body.trainingTitle;
    training.companyName = req.body.companyName;
    training.location = req.body.location;
    training.startAt = req.body.startAt;
    training.endAt = req.body.endAt;
    training.trainingType = req.body.trainingType;
    training.trainingDescription = req.body.trainingDescription;
    training.capacity = req.body.capacity;
    training.topicsCovered = req.body.topicsCovered;

    await training.save();
    res.json(training);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
}
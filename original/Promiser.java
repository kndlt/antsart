public class Promiser {
        //Dont change this just extend it
        public float x=1;
        public float y=1;
        public float lastX=1;
        public float lastY=1;
        
        public float speed=0.2f;
        public Object currentTarget=null;
        /** Creates a new instance of Promiser */
        public Promiser(float x, float y, float speed) {
                this.x=x;
                this.y=y;
                lastX=x;
                lastY=y;
                this.speed=speed;
        }
        
        public void act()
        {

                if(currentTarget instanceof Promiser)
                {
                        
                        
                        //move toward target
                        currentTarget=(Promiser) currentTarget;
                        float dx=((Promiser)currentTarget).x-x;
                        float dy=((Promiser)currentTarget).y-y;
                        float distance= (float)Math.sqrt(dy*dy+dx*dx);
                        if(distance!=0){
                        float ratio= speed/distance;
                        lastX=x;
                        lastY=y;
                        x+=dx*ratio;
                        y+=dy*ratio;
                        }
                }
                //call current promise
                //search for target
        }
        
}

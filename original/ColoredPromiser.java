/*
 * ColoredPromiser.java
 *
 * Created on 2004�� 11�� 30�� (ȭ), ���� 7:23
 */

/**
 *
 * @author  Gibatte
 */
public class ColoredPromiser extends FirstPromiser{
        
        public ColoredPromiser(float x, float y, float speed,boolean isStatic) {
                super(x,y,speed,isStatic);
                //hitDistance=(int)(speed/4*3);
                this.isStatic=isStatic;
        }

        
}
